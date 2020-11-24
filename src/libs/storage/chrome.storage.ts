import { DateTime } from 'luxon';
import {
  bindCallback,
  forkJoin,
  Observable,
} from 'rxjs';
import {
  map,
  pluck,
} from 'rxjs/operators';
import {
  ACTIONS_SET,
  STORAGE_KEYS,
} from '../../constants';

export interface UserSettings {
  [STORAGE_KEYS.BADGE_ACTIVE]: boolean;
  [STORAGE_KEYS.BADGE_VISITED]: DateTime;
  [STORAGE_KEYS.BIRTHDAYS]: Array<{ name: string; href: string; start: DateTime }>;
  [STORAGE_KEYS.LAST_ACTIVE_TAB]: number;
  [STORAGE_KEYS.LAST_SELECTED_ACTION]: ACTIONS_SET;
}

export interface StoredUserSettings {
  [STORAGE_KEYS.BADGE_ACTIVE]: boolean;
  [STORAGE_KEYS.BADGE_VISITED]: number;
  [STORAGE_KEYS.BIRTHDAYS]: Array<[string, number, string]>;
  [STORAGE_KEYS.LAST_ACTIVE_TAB]: number;
  [STORAGE_KEYS.LAST_SELECTED_ACTION]: ACTIONS_SET;
}

const DEFAULT_USER_SETTINGS: UserSettings = {
  [STORAGE_KEYS.BADGE_ACTIVE]: false,
  [STORAGE_KEYS.BADGE_VISITED]: DateTime.fromMillis(0),
  [STORAGE_KEYS.BIRTHDAYS]: [],
  [STORAGE_KEYS.LAST_ACTIVE_TAB]: 1,
  [STORAGE_KEYS.LAST_SELECTED_ACTION]: ACTIONS_SET.SELECT_FILE_FORMAT_ICS,
};

export function getLastTimeClickedBadge(): Observable<DateTime> {
  return retrieveUserSettings([STORAGE_KEYS.BADGE_VISITED])
    .pipe(
      pluck(STORAGE_KEYS.BADGE_VISITED),
    );
}

/**
 * Today's birthday
 */
export function getTodayBirthdays(): Observable<Array<{ name: string; href: string; start: DateTime }>> {
  const ordinal = DateTime.local().ordinal; // Today's ordinal
  return retrieveUserSettings([STORAGE_KEYS.BIRTHDAYS])
    .pipe(
      pluck(STORAGE_KEYS.BIRTHDAYS),
      map((raw: Array<{ name: string; href: string; start: DateTime }>) => {
        return raw.filter(r => r.start.ordinal === ordinal);
      }),
    );
}

/**
 * Observable with today's birthdays and last time user clicked on badge
 */
export function getInfoForBadge(): Observable<{
  birthdays: Array<{ name: string; href: string; start: DateTime }>;
  dateVisited: DateTime
}> {

  return forkJoin({
      birthdays: getTodayBirthdays(),
      dateVisited: getLastTimeClickedBadge(),
    },
  );
}

/**
 * Store data to sessionStorage
 * @TODO Make it Observable
 */
export function storeLastBadgeClicked(): Observable<void> {
  return storeUserSettings({
    [STORAGE_KEYS.BADGE_VISITED]: DateTime.local(),
  });
}

export function retrieveUserSettings(keys: Array<STORAGE_KEYS> = null) {
  return bindCallback<Array<STORAGE_KEYS>, { [key: string]: any }>(chrome.storage.local.get)
    .call(chrome.storage.local, keys)
    .pipe(
      map(data => {
        // @TODO Make better default value handler
        const result: Partial<UserSettings> = (keys || Object.keys(DEFAULT_USER_SETTINGS) as Array<STORAGE_KEYS>)
          .reduce((c, key) => {
            // @ts-ignore
            c[key] = DEFAULT_USER_SETTINGS[key];
            return c;
          }, {} as Partial<UserSettings>);

        if (data[STORAGE_KEYS.BADGE_VISITED]) {
          data[STORAGE_KEYS.BADGE_VISITED] = DateTime.fromMillis(data[STORAGE_KEYS.BADGE_VISITED]);
        }

        if (data[STORAGE_KEYS.BIRTHDAYS]) {
          data[STORAGE_KEYS.BIRTHDAYS] = decodeEvents(data[STORAGE_KEYS.BIRTHDAYS]);
        }

        return Object.assign(result, data as Partial<UserSettings>);
      }),
    );
}

export function storeUserSettings(settings: Partial<UserSettings>): Observable<void>;
export function storeUserSettings(settings: Partial<UserSettings>, dontWait: boolean): void;
export function storeUserSettings(settings: Partial<UserSettings>, dontWait?: boolean) {
  const data: Partial<StoredUserSettings> = {};

  if (settings[STORAGE_KEYS.BADGE_VISITED]) {
    data[STORAGE_KEYS.BADGE_VISITED] = settings[STORAGE_KEYS.BADGE_VISITED].toMillis();
  }

  if (settings[STORAGE_KEYS.BIRTHDAYS]) {
    data[STORAGE_KEYS.BIRTHDAYS] = settings[STORAGE_KEYS.BIRTHDAYS].map((event) => [
        event.name,
        event.start.ordinal, // Day of the year in 2020
        // Remove https://facebook.com/ to reduce the size, using indexOf since facebook subdomain can vary
        event.href.slice(event.href.indexOf('/', 8) + 1), // 8 = 'https://'.length
      ],
    );
  }
  if ('undefined' === typeof dontWait) {
    return bindCallback(chrome.storage.local.set)
      .call(chrome.storage.local, Object.assign({}, settings, data));
  }

  chrome.storage.local.set(Object.assign({}, settings, data));
}

export function clearStorage() {
  chrome.storage.local.clear();
}

function decodeEvents(data: Array<[string, number, string]>) {
  return data.map(
    ([name, ordinal, hrefPartial]) => ({
      name,
      start: DateTime.local(2020) // use 2020 since date was originally from 2020
        .set({ordinal}) // Set ordinal of 2020
        .set({year: DateTime.local().year}), // Convert to current year
      href: 'https://facebook.com/' + hrefPartial,
    }),
  );
}
