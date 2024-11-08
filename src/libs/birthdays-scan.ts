import update from 'immutability-helper';
import { Observable } from 'rxjs';
import {
  filter,
  map,
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
import { fetchUserFriendsBirthdayInfoFromContext } from './executed-scripts/executed-script-scan';
import {
  retrieveUserSettings,
  storeUserSettings,
} from './storage/chrome.storage';
import {
  STORED_BIRTHDAY, STORED_BIRTHDAY_SETTINGS,
  StoredBirthday,
} from './storage/storaged.types';

/**
 * Check provided string match any facebook url pattern
 *
 * @param url - string to match with facebook url regexp pattern
 */
function isOnFacebookPage(url: string): boolean {
  return !!url.match(FACEBOOK_REQUIRED_REGEXP);
}

/**
 * Check that the current page is facebook and emit its Tab (`chrome.tabs.Tab`)
 * Throws error {type: SCAN_ERROR_FACEBOOK_REQUIRED} when not of a facebook
 */
export const getFacebookTab = (): Observable<chrome.tabs.Tab> => new Observable((subscriber) => {
  const urlPatterns = [
    '*://*.facebook.com/*',
  ];

  chrome.tabs.query(
    { url: urlPatterns },
    (tabs) => {
      const url = tabs[0]?.url;
      // check currTab.url is a Facebook page
      if (typeof url === 'string') {
        subscriber.next(tabs[0]);
      } else {
        subscriber.error({ type: SCAN_ERROR_FACEBOOK_REQUIRED });
      }
    },
  );

  return () => subscriber.complete();
});

/**
 * Check that the current page is facebook and emit its Tab (`chrome.tabs.Tab`)
 * Throws error {type: SCAN_ERROR_FACEBOOK_REQUIRED} when not of a facebook
 */
export const getFacebookTabOld = (): Observable<chrome.tabs.Tab> => new Observable((subscriber) => {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    (tabs) => {
      const url = tabs[0]?.url;
      // check currTab.url is a Facebook page
      if (typeof url === 'string' && isOnFacebookPage(url)) {
        subscriber.next(tabs[0]);
        return;
      }

      subscriber.error({ type: SCAN_ERROR_FACEBOOK_REQUIRED });
    },
  );

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
    chrome.scripting.executeScript(
      {
        target: { tabId },
        // world: "MAIN",
        func: fetchUserFriendsBirthdayInfoFromContext,
      },
      (response) => {
        // Working with a single tab, use the firs array element
        waitForResponse(response[0].result);
      },
    );

    /**
     * Listen to response from page report messages,
     * It should come with unique responseId and have a type
     * `EXECUTED_SCRIPT_RESPONSE`
     */
    const waitForResponse = (responseId: string) => listenTo<ExecutedScriptScanResponseAction>(EXECUTED_SCRIPT_RESPONSE)
      .pipe(
        filter(({ action }) => action.responseId === responseId),
        timeout(waitTime), // Wait up to 10 seconds (default) till context page response
        take(1),
      )
      .subscribe({
        next: ({ action }) => {
          switch (action.payload.type) {
            case SCAN_SUCCESS:
              subscriber.next(action.payload.users);
              subscriber.complete();
              break;
            default:
              subscriber.error(action.payload);
          }
        },
        error: () => {
          subscriber.error({ type: SCAN_ERROR_TIMEOUT });
        },
        complete: () => subscriber.complete(),
      });
  });
}

export const sendScanLog = (str: string, reps: Array<string> = []) => {
  sendMessage(SendScanLog(str, reps));
};

/**
 * RestoredBirthday have basic information extracted from parsed html, such as
 * facebook id, name, and birthdate
 */
function scannedUserToDecayedBirthday(raw: RawScannedUser): StoredBirthday {
  return [
    raw.name,
    raw.id,
    [raw.birthdate.day, raw.birthdate.month, raw.birthdate.year],
    null,
    createStoredUserSettings(raw.misc?.source === 'manual' ? STORED_BIRTHDAY_SETTINGS.CUSTOM_MADE : 0),
  ];
}


export function createStoredUserSettings(...settings: STORED_BIRTHDAY_SETTINGS[]): number {
  return settings.reduce((acc, setting) => acc | setting, 0);
}

/**
 * Toggle stored user settings, we use bitwise operations to toggle settings
 */
export function toggleStoredUserSettings(settings: number, flag: STORED_BIRTHDAY_SETTINGS, state: "on" | "off") {
  if (state === "on") {
    return settings | flag;
  }
  return settings & ~flag;
}

/**
 * Merge sets of Arrays of StoredBirthdays
 * Every next set have greater priority, so in order to preserve already scanned birthdays (duplicates) and not override possible changes
 * make sure to provide them as the last argument of the function
 * for example mergeBirthdaysAllowDatesUpdate(newBirthdays, oldBirthdays)
 *
 * The only exception is birthdate year property, script will always try to update with a year even if it comes from newest duplicate row.
 *
 * @param groupArray array of groups of StoredBirthday
 */
function mergeBirthdaysAllowDatesUpdate(...groupArray: Array<Array<StoredBirthday>>) {
  const mappedBirthdays = ([] as Array<StoredBirthday>)
    .concat(...groupArray)
    .reduceRight<Map<string, StoredBirthday>>(
      (collector, birthday) => {
        const uid = birthday[STORED_BIRTHDAY.UID];
        if (!collector.has(uid)) {
          return collector.set(uid, birthday);
        }

        // update birthdate in case duplicate birthdate has a 'year'
        const year = birthday[STORED_BIRTHDAY.BIRTH_DATE][2];
        if (typeof year === 'number' && typeof collector.get(uid)[STORED_BIRTHDAY.BIRTH_DATE][2] !== 'number') {
          collector.set(uid, update(birthday, { [STORED_BIRTHDAY.BIRTH_DATE]: { 2: { $set: year } } }));
        }
        return collector;
      },
      new Map(),
    );

  return Array.from(mappedBirthdays.values());
}

export function updateStoredBirthdays(rawUsers: Array<RawScannedUser>) {
  return retrieveUserSettings(['birthdays', 'activated'])
    .pipe(
      // Merge with stored birthdays
      tap(() => sendScanLog('SCAN_LOG_MERGING_BIRTHDAYS')),

      map(({ birthdays: oldBirthdays }) => {
        const birthdays = rawUsers.map(scannedUserToDecayedBirthday);
        return mergeBirthdaysAllowDatesUpdate(birthdays, oldBirthdays);
      }),

      // Store fetched data for further usage
      tap(() => sendScanLog('SCAN_LOG_STORING_EXTRACTED_BIRTHDAYS')),
      switchMap((combinedBirthdays) => storeUserSettings({
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
      map(tab => tab.id),
      switchMap((tabId) => scanUserBirthdays(tabId, 30_000)),
      switchMap(updateStoredBirthdays),
    );
}
