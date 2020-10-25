import { DateTime } from 'luxon';
import {
  bindCallback,
  Observable,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { STORAGE_KEY } from '../constants';
import {
  prepareEvent,
  RawEvent,

} from './lib';

/**
 * Observable with today's birthdays and last time user clicked on badge
 */
export function getTodayBirthdays(): Observable<{ birthdays: Array<RawEvent>; dateVisited: DateTime }> {
  const getStorageFactory =
    (keys: string[] | string) => (cb: (items: { [key: string]: any }) => void) => chrome.storage.local.get(keys, cb);

  return bindCallback<{ [key: string]: any }>(getStorageFactory([STORAGE_KEY.DATA, STORAGE_KEY.BADGE_VISITED]))()
    .pipe(
      map(data => {
        const raw: Array<RawEvent> = data[STORAGE_KEY.DATA] || []; // Stored raw birthdays
        const dateVisited = DateTime.fromMillis(data[STORAGE_KEY.BADGE_VISITED] || 0); // unix timestamp last time clicked on badge

        const ordinal = DateTime.local().ordinal; // Today's ordinal
        const year = DateTime.local().year; // year today
        const birthdays = raw.filter(r => prepareEvent(r, year).start.ordinal === ordinal);

        return {birthdays, dateVisited};
      }),
    );
}

/**
 * Fetch data from sessionStorage
 * Made it Observable to easy fit chrome.storage functionality
 */
export function retrieveBirthdays(): Observable<Map<string, RawEvent>> {
  try {
    const items: Array<[string, RawEvent]> =
      (JSON.parse(sessionStorage.getItem(STORAGE_KEY.DATA)) as Array<RawEvent>)
        .map(i => [i.uid, i]);
    return of(new Map(items));
  } catch (e) {
    return of(null);
  }
}

/**
 * Store data to sessionStorage
 * Made it Observable to easy fit chrome.storage functionality
 */
export function storeBirthdays(events: Map<string, RawEvent>): Observable<null> {
  const asArray = Array.from(events.values());
  sessionStorage.setItem(STORAGE_KEY.DATA, JSON.stringify(asArray));
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
