import { DateTime } from 'luxon';
import {
  bindCallback,
  Observable,
  of,
  zip,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { STORAGE_KEY } from '../constants';
import {
  prepareEvent,
  RawEvent,

} from './lib';

const getStorageFactory =
  (keys: string[] | string) => (cb: (items: { [key: string]: any }) => void) => chrome.storage.local.get(keys, cb);

/**
 *
 */
export function getBirthdays(): Observable<Array<RawEvent>> {
  return bindCallback<{ [key: string]: any }>(getStorageFactory([STORAGE_KEY.DATA]))()
    .pipe(
      map(data => data[STORAGE_KEY.DATA]), // Stored raw birthdays
    );
}

export function getLastTimeClickedBadge(): Observable<DateTime> {
  return bindCallback<{ [key: string]: any }>(getStorageFactory([STORAGE_KEY.BADGE_VISITED]))()
    .pipe(
      map(data => DateTime.fromMillis(data[STORAGE_KEY.BADGE_VISITED] || 0)),
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
  return zip(
    getTodayBirthdays(),
    getLastTimeClickedBadge(),
  ).pipe(
    map(([birthdays, dateVisited]) => ({birthdays, dateVisited})),
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
  //     (JSON.parse(sessionStorage.getItem(STORAGE_KEY.DATA)) as Array<RawEvent>)
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
  // sessionStorage.setItem(STORAGE_KEY.DATA, JSON.stringify(asArray));
  chrome.storage.local.set({[STORAGE_KEY.DATA]: asArray});
  return of(null);
}

/**
 * Store data to sessionStorage
 * Made it Observable to easy fit chrome.storage functionality
 */
export function storeLastBadgeClicked() {
  chrome.storage.local.set({[STORAGE_KEY.BADGE_VISITED]: DateTime.local().toMillis()});
}
