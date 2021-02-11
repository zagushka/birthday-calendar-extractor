import { DateTime } from 'luxon';
import {
  Observable,
  of,
  throwError,
  zip,
} from 'rxjs';
import {
  filter,
  map,
  mapTo,
  switchMap,
  take,
  tap,
  timeout,
} from 'rxjs/operators';
import { FACEBOOK_REQUIRED_REGEXP } from '../constants';
import { fetchUserFriendsBirthdayInfoFromContext } from '../context';
import {
  BirthdaysScanComplete,
  SendScanLog,
} from './events/actions';
import {
  listenTo,
  sendMessage,
} from './events/events';
import {
  EXECUTED_SCRIPT_CONTEXT_ERROR,
  EXECUTED_SCRIPT_CONTEXT_RESPONSE,
  ExecutedScriptContextResponseAction,
  RawScannedUser,
} from './events/types';
import {
  RestoredBirthday,
  retrieveUserSettings,
  storeUserSettings,
} from './storage/chrome.storage';

export interface PreparedEvent {
  uid: string; // User Id, unique id generated from facebook page url
  name: string;
  start: DateTime;
  end: DateTime;
  href: string;
}

/**
 * Convert array of strings to escaped array by converting by stringifying array and removing wrapping []
 */
export function arrayToCSVRow(notEscaped: Array<string>): string {
  return JSON.stringify(notEscaped).slice(1, -1);
}

export const sendScanLog = (str: string, reps: Array<string> = []) => {
  sendMessage(SendScanLog(str, reps), true);
};

/**
 * Convert RawEvent to PreparedEvent
 * * Validate date
 * * Take care of leap year
 * * Generate uid from user href
 * * convert to the form suitable for further usage
 */
export function prepareEvent(event: RestoredBirthday, year: number): PreparedEvent {
  // @TODO Check RestoredBirthday start, is it local, is it utc? Cause in output formats it should be utc
  // Take care of leap year
  // Since all coming birthdays are from 2020 (leap year) 02/29 can occur
  // I change the year to required and
  // luxon knows to handle leap years and change 29 to 28 for Feb if needed
  const start = event.start.set({year: year});

  // Wrong date
  if (!start.isValid) {
    return null;
  }

  return {
    name: event.name,
    start: start,
    end: start.plus({days: 1}),
    href: event.href,
    uid: window.btoa(event.href),
  };
}

/**
 * Generate Array of events for required years range
 * RawEvent is not connected to any year, so we convert it to PreparedEvent and assign the year
 */
export function generatePreparedEventsForYears(events: Array<RestoredBirthday>, year: number, tillYear: number): Array<PreparedEvent> {
  const result: Array<PreparedEvent> = [];

  do {
    events.forEach(event => {
      const preparedEvent = prepareEvent(event, year);
      if (preparedEvent) {
        result.push(preparedEvent);
      }
    });
    year++;
    // Generate for all required years
  } while (tillYear >= year);

  return result;
}

/**
 * RestoredBirthday have basic information extracted from parsed html, such as
 * facebook id, user name, and birthdate
 */
function scannedUserToRestoredBirthday(raw: RawScannedUser): RestoredBirthday {
  return {
    name: raw.name,
    start: DateTime.local(2020, raw.birthdate.month, raw.birthdate.day).set({year: DateTime.local().year}),
    href: 'https://facebook.com/' + raw.id,
  };
}

function isOnFacebookPage(url: string): boolean {
  return !!url.match(FACEBOOK_REQUIRED_REGEXP);
}

export function forceUserBirthdaysScanFromContext(): Observable<Array<RawScannedUser>> {
  return new Observable((subscriber) => {

    /**
     * Listen to response from page context response
     * It should come with unique responseId
     */
    const waitForResponse = (responseId: string) => {
      return listenTo(EXECUTED_SCRIPT_CONTEXT_RESPONSE, EXECUTED_SCRIPT_CONTEXT_ERROR)
        .pipe(
          filter(({action}) => (action as ExecutedScriptContextResponseAction).payload.responseId === responseId),
          timeout(10000), // Wait up to 10 seconds till context page response
          take(1),
        )
        .subscribe(
          ({action}) => {
            switch (action.type) {
              case EXECUTED_SCRIPT_CONTEXT_RESPONSE:
                subscriber.next(action.payload.users);
                break;
              case EXECUTED_SCRIPT_CONTEXT_ERROR:
                subscriber.error(action.payload.error);
                break;
            }
            subscriber.complete();
          },
          () => subscriber.error('SCAN_TIMEOUT'),
        );
    };

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const currTab = tabs[0];

      // check currTab.url is a Facebook page
      if (!currTab || !isOnFacebookPage(currTab.url)) {
        subscriber.error('FACEBOOK_REQUIRED');
        return;
      }

      // @ts-ignore
      chrome.scripting.executeScript({
          // @ts-ignore
          target: {tabId: currTab.id},
          function: fetchUserFriendsBirthdayInfoFromContext,
        },
        (response: Array<{ result: any }>) => {
          // Working with a single tab, use the firs array element
          waitForResponse(response[0].result);
        });

    });
  });
}

/**
 * Make new full scan of the birthdays data
 * Store fetched data to local storage
 */
export function forceBirthdaysScan() {
  // First of all check for the token and language
  // Fetch the data from facebook
  return forceUserBirthdaysScanFromContext()
    .pipe(
      map(rawUsers => rawUsers.map(scannedUserToRestoredBirthday)),
      switchMap((users) => zip(of(users), retrieveUserSettings(['birthdays', 'activated']))),

      // Merge with stored birthdays
      map(([birthdays, {birthdays: oldBirthdays, activated}]) => {
        // Merge old birthdays and new birthdays converted to arrays for Map'ping
        const nonUniques: Array<[string, RestoredBirthday]> =
          birthdays.map<[string, RestoredBirthday]>(b => [b.href, b])
            .concat(oldBirthdays.map(b => [b.href, b]));

        // Map  birthdays to remove duplicates, older values survive
        return Array.from((new Map(nonUniques)).values());
      }),

      // Store fetched data for further usage
      switchMap(combinedBirthdays => {
        sendScanLog('SCAN_LOG_STORING_EXTRACTED_BIRTHDAYS');
        return storeUserSettings({birthdays: combinedBirthdays, activated: true})
          .pipe(
            mapTo(combinedBirthdays),
          );
      }),

      // Send message `scan is complete`
      tap(() => sendMessage(BirthdaysScanComplete(), true)),
    );
}

export function getBirthdaysList(): Observable<Array<RestoredBirthday>> {
  return retrieveUserSettings(['birthdays', 'activated'])
    .pipe(
      switchMap(({birthdays, activated}) => {
        if (activated) {
          // Using cached version
          return of(birthdays);
        }

        // We should never reach this line
        return throwError('SCAN BIRTHDAYS FIRST');
      }),
    );
}
