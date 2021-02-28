import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import {
  filter,
  map,
  pluck,
  switchMap,
  take,
  tap,
  timeout,
} from 'rxjs/operators';
import { FACEBOOK_REQUIRED_REGEXP } from '../constants';
import { SendScanLog } from './events/actions';
import {
  listenTo,
  sendMessage,
} from './events/events';
import {
  EXECUTED_SCRIPT_RESPONSE,
  ExecutedScriptScanResponseAction,
  RawScannedUser,
  SCAN_ERROR_FACEBOOK_REQUIRED,
  SCAN_ERROR_TIMEOUT,
  SCAN_SUCCESS,
} from './events/executed-script.types';
import { fetchUserFriendsBirthdayInfoFromContext } from './executed-script-scan';
import {
  retrieveUserSettings,
  storeUserSettings,
} from './storage/chrome.storage';
import { RestoredBirthday } from './storage/storaged.types';

/**
 * Check provided string match any facebook url pattern
 *
 * @param url - string to match with facebook url regexp pattern
 */
function isOnFacebookPage(url: string): boolean {
  return !!url.match(FACEBOOK_REQUIRED_REGEXP);
}

/**
 * Check current page is facebook and emit its Tab (`chrome.tabs.Tab`)
 * Throws error {type: SCAN_ERROR_FACEBOOK_REQUIRED} when not of a facebook
 */
export const getFacebookTab = (): Observable<chrome.tabs.Tab> => new Observable(subscriber => {
  chrome.tabs.query({active: true, currentWindow: true},
    (tabs) => {
      const url = tabs[0]?.url;
      // check currTab.url is a Facebook page
      if ('string' === typeof url && isOnFacebookPage(url)) {
        subscriber.next(tabs[0]);
        return;
      }

      subscriber.error({type: SCAN_ERROR_FACEBOOK_REQUIRED});
    });

  return () => subscriber.complete();
});

/**
 * Initiate Birthdays scan
 * This is a wrapper for `fetchUserFriendsBirthdayInfoFromContext` function executed on the page
 * It creates Observable and resolve it the moment page script have something to report or throws an error
 * There is 10 seconds default timeout for the Observable
 *
 * @param tabId - chrome.tabs.Tab.id of the page to execute the script on
 * @param waitTime - time to wait before Observable throws an error, 10 seconds default value
 */
export function scanUserBirthdays(tabId: number, waitTime = 10_000): Observable<Array<RawScannedUser>> {
  return new Observable((subscriber) => {
    // @ts-ignore
    chrome.scripting.executeScript({
        target: {tabId},
        function: fetchUserFriendsBirthdayInfoFromContext,
      },
      (response: Array<{ result: any }>) => {
        // Working with a single tab, use the firs array element
        waitForResponse(response[0].result);
      });

    /**
     * Listen to response from page report messages,
     * It should come with unique responseId and have a type
     * `EXECUTED_SCRIPT_RESPONSE`
     */
    const waitForResponse = (responseId: string) => {
      return listenTo<ExecutedScriptScanResponseAction>(EXECUTED_SCRIPT_RESPONSE)
        .pipe(
          filter(({action}) => action.responseId === responseId),
          timeout(waitTime), // Wait up to 10 seconds till context page response
          take(1),
        )
        .subscribe({
          next: ({action}) => {
            switch (action.payload.type) {
              case SCAN_SUCCESS:
                subscriber.next(action.payload.users);
                subscriber.complete();
                break;
              default:
                subscriber.error(action.payload);
            }
          },
          error: (error) => {
            subscriber.error({type: SCAN_ERROR_TIMEOUT});
          },
          complete: () => subscriber.complete(),
        });
    };
  });
}

export const sendScanLog = (str: string, reps: Array<string> = []) => {
  sendMessage(SendScanLog(str, reps), true);
};

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

export function updateStoredBirthdays(rawUsers: Array<RawScannedUser>) {
  return retrieveUserSettings(['birthdays', 'activated'])
    .pipe(
      // Merge with stored birthdays
      tap(() => sendScanLog('SCAN_LOG_MERGING_BIRTHDAYS')),
      map(({birthdays: oldBirthdays}) => {
        const birthdays = rawUsers.map(scannedUserToRestoredBirthday);
        // Merge old birthdays and new birthdays converted to arrays for Map'ping
        const nonUniques: Array<[string, RestoredBirthday]> =
          birthdays.map<[string, RestoredBirthday]>(b => [b.href, b])
            .concat(oldBirthdays.map(b => [b.href, b]));

        // Map  birthdays to remove duplicates, older values survive
        return Array.from((new Map(nonUniques)).values());
      }),

      // Store fetched data for further usage
      tap(() => sendScanLog('SCAN_LOG_STORING_EXTRACTED_BIRTHDAYS')),
      switchMap(combinedBirthdays => storeUserSettings({
        birthdays: combinedBirthdays, activated: true,
      }, true)),
    );
}

/**
 * Make new full scan of the birthdays data
 * Store fetched data to local storage
 */
export function forceBirthdaysScan() {
  // Check user on a facebook page and fetch current Tab info
  return getFacebookTab()
    .pipe(
      // Check for the token and language
      // Fetch the data from facebook
      pluck('id'),
      switchMap((tabId) => scanUserBirthdays(tabId, 10_000)),
      switchMap(updateStoredBirthdays),
    );
}
