import { DateTime } from 'luxon';
import {
  bindCallback,
  forkJoin,
  Observable,
  of,
} from 'rxjs';
import {
  map,
  pluck,
} from 'rxjs/operators';
import {
  ACTIONS_SET,
  STORAGE_KEYS,
} from '../constants';
import {
  prepareEvent,
  RawEvent,
} from './lib';

export interface UserSettings {
  [STORAGE_KEYS.BADGE_ACTIVE]: boolean;
  [STORAGE_KEYS.BADGE_VISITED]: DateTime;
  [STORAGE_KEYS.BIRTHDAYS]: any;
  [STORAGE_KEYS.LAST_ACTIVE_TAB]: number;
  [STORAGE_KEYS.LAST_SELECTED_ACTION]: ACTIONS_SET;
}

const getStorageFactory =
  (keys: string[] | string) => (cb: (items: { [key: string]: any }) => void) => chrome.storage.local.get(keys, cb);

/**
 *
 */
export function getBirthdays(): Observable<Array<RawEvent>> {
  return bindCallback<{ [key: string]: any }>(getStorageFactory([STORAGE_KEYS.BIRTHDAYS]))()
    .pipe(
      map(data => data[STORAGE_KEYS.BIRTHDAYS]), // Stored raw birthdays
    );
}

export function getLastTimeClickedBadge(): Observable<DateTime> {
  return retrieveUserSettings([STORAGE_KEYS.BADGE_VISITED])
    .pipe(
      pluck(STORAGE_KEYS.BADGE_VISITED),
    );
}

/**
 *
 */
export function getLastActiveTab(): Observable<number> {
  return bindCallback<{ [key: string]: any }>(getStorageFactory([STORAGE_KEYS.LAST_ACTIVE_TAB]))()
    .pipe(
      map(data => data[STORAGE_KEYS.LAST_ACTIVE_TAB]), // Stored last active tab
    );
}

/**
 * Today's birthday
 */
export function getTodayBirthdays(): Observable<Array<RawEvent>> {
  return getBirthdays()
    .pipe(
      map(raw => {
        if (!raw) {
          return [];
        }
        const ordinal = DateTime.local().ordinal; // Today's ordinal
        const year = DateTime.local().year; // year today
        return raw.filter(r => prepareEvent(r, year).start.ordinal === ordinal);
      }),
    );
}

/**
 * Observable with today's birthdays and last time user clicked on badge
 */
export function getInfoForBadge(): Observable<{ birthdays: Array<RawEvent>; dateVisited: DateTime }> {
  return forkJoin({
      birthdays: getTodayBirthdays(),
      dateVisited: getLastTimeClickedBadge(),
    },
  );
}

/**
 * Fetch data from sessionStorage
 * Made it Observable to easy fit chrome.storage functionality
 */
export function retrieveBirthdays(): Observable<Map<string, RawEvent>> {
  return getBirthdays()
    .pipe(
      map(data => {
        if (!data) {
          return null;
        }
        return new Map(data.map(i => [i.uid, i]));
      }),
    );
  // try {
  //   const items: Array<[string, RawEvent]> =
  //     (JSON.parse(sessionStorage.getItem(STORAGE_KEYS.BIRTHDAYS)) as Array<RawEvent>)
  //       .map(i => [i.uid, i]);
  //   return of(new Map(items));
  // } catch (e) {
  //   return of(null);
  // }
}

/**
 * Store data to sessionStorage
 * Made it Observable to easy fit chrome.storage functionality
 */
export function storeBirthdays(events: Map<string, RawEvent>): Observable<null> {
  const asArray = Array.from(events.values());
  // sessionStorage.setItem(STORAGE_KEYS.BIRTHDAYS, JSON.stringify(asArray));
  chrome.storage.local.set({[STORAGE_KEYS.BIRTHDAYS]: asArray});
  return of(null);
}

/**
 * Store data to sessionStorage
 * @TODO Make it Observable
 */
export function storeLastBadgeClicked() {
  storeUserSettings({
    [STORAGE_KEYS.BADGE_VISITED]: DateTime.local(),
  });
  // chrome.storage.local.set({[STORAGE_KEYS.BADGE_VISITED]: DateTime.local().toMillis()});
}

export function retrieveUserSettings(keys: Array<string> = null) {
  return bindCallback<{ [key: string]: any }>(getStorageFactory(keys))()
    .pipe(
      map(data => {
        if (data[STORAGE_KEYS.BADGE_VISITED]) {
          data[STORAGE_KEYS.BADGE_VISITED] = DateTime.fromMillis(data[STORAGE_KEYS.BADGE_VISITED]);
        }
        return data as Partial<UserSettings>;
      }), // Stored raw birthdays
    );
}

export function storeUserSettings(settings: Partial<UserSettings>, callback?: () => void): void {
  const data: { [key: string]: any } = Object.assign({}, settings);

  if (settings[STORAGE_KEYS.BADGE_VISITED]) {
    data[STORAGE_KEYS.BADGE_VISITED] = settings[STORAGE_KEYS.BADGE_VISITED].toMillis();
  }
  chrome.storage.local.set(data, callback);
}
