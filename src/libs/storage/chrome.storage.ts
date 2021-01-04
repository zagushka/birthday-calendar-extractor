import update from 'immutability-helper';
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
  StorageKeyNames,
  TABS,
} from '../../constants';
import { WizardsSettings } from '../../context/settings.context';

export interface Settings {
  [STORAGE_KEYS.BADGE_ACTIVE]: boolean;
  [STORAGE_KEYS.LAST_ACTIVE_TAB]: TABS;
  [STORAGE_KEYS.LAST_SELECTED_ACTION]: ACTIONS_SET;
  [STORAGE_KEYS.WIZARDS]: WizardsSettings;
  [STORAGE_KEYS.BADGE_VISITED]: DateTime;
  [STORAGE_KEYS.BIRTHDAYS]: Array<RestoredBirthday>;
}

export interface StoredSettings {
  [STORAGE_KEYS.BADGE_ACTIVE]: boolean;
  [STORAGE_KEYS.BADGE_VISITED]: number;
  [STORAGE_KEYS.BIRTHDAYS]: Array<StoredBirthday>;
  [STORAGE_KEYS.LAST_ACTIVE_TAB]: TABS;
  [STORAGE_KEYS.LAST_SELECTED_ACTION]: ACTIONS_SET;
  [STORAGE_KEYS.WIZARDS]: WizardsSettings;
}

export type StoredBirthday = [string, number, string];

export interface RestoredBirthday {
  name: string;
  href: string;
  start: DateTime
}

export const DEFAULT_SETTINGS: Settings = {
  [STORAGE_KEYS.BADGE_ACTIVE]: false,
  [STORAGE_KEYS.BADGE_VISITED]: DateTime.fromMillis(0),
  [STORAGE_KEYS.BIRTHDAYS]: [],
  [STORAGE_KEYS.LAST_ACTIVE_TAB]: TABS.CALENDAR_GENERATOR,
  [STORAGE_KEYS.LAST_SELECTED_ACTION]: ACTIONS_SET.SELECT_FILE_FORMAT_ICS,
  [STORAGE_KEYS.WIZARDS]: {csv: {format: 'dd/mm'}, ics: {allDayEvent: false, groupEvents: false}},
};


/**
 * Helper wrapper function to be used with rxjs bindCallback
 */
const setWrapper = <T>(parameters: T, callback: () => void) => chrome.storage.local.set(parameters, callback);

export function getLastTimeClickedBadge(): Observable<DateTime> {
  return retrieveUserSettings([STORAGE_KEYS.BADGE_VISITED])
    .pipe(
      pluck(STORAGE_KEYS.BADGE_VISITED),
    );
}

/**
 * Fetch all birthdays form local storage and filter for today's
 */

export function getBirthdaysForDate(date: DateTime): Observable<Array<RestoredBirthday>> {
  return retrieveUserSettings([STORAGE_KEYS.BIRTHDAYS])
    .pipe(
      pluck(STORAGE_KEYS.BIRTHDAYS),
      map(birthdays => filterBirthdaysForDate(birthdays, date)),
    );
}

export function filterBirthdaysForDate(birthdays: Array<RestoredBirthday>, date: DateTime = DateTime.local()): Array<RestoredBirthday> {
  const ordinal = date.ordinal;
  return birthdays.filter(r => r.start.ordinal === ordinal);
}

/**
 * Observable with today's birthdays and last time user clicked on badge
 */
export function getInfoForBadge(today: DateTime = DateTime.local()): Observable<{
  birthdays: Array<RestoredBirthday>;
  dateVisited: DateTime
}> {

  return forkJoin({
      birthdays: getBirthdaysForDate(today),
      dateVisited: getLastTimeClickedBadge(),
    },
  );
}

/**
 * Store data to sessionStorage
 */
export function storeLastBadgeClicked(): Observable<void> {
  return storeUserSettings({
    [STORAGE_KEYS.BADGE_VISITED]: DateTime.local(),
  });
}

const reviveBirthday = ([name, ordinal, hrefPartial]: StoredBirthday): RestoredBirthday => {
  return {
    name,
    start: DateTime.local(2020) // use 2020 since date was originally from 2020
      .set({ordinal}) // Set ordinal of 2020
      .set({year: DateTime.local().year}), // Convert to current year
    href: 'https://facebook.com/' + hrefPartial,
  };
};

const decayBirthday = (birthday: RestoredBirthday): StoredBirthday => {
  return [
    birthday.name,
    birthday.start.ordinal, // Day of the year in 2020
    // Remove https://facebook.com/ to reduce the size, using indexOf since facebook subdomain can vary
    birthday.href.slice(birthday.href.indexOf('/', 8) + 1), // 8 = 'https://'.length
  ];
};

export function retrieveUserSettings(keys: Array<StorageKeyNames> = []) {
  return bindCallback<Array<StorageKeyNames>, Partial<StoredSettings>>(chrome.storage.local.get)
    .call(chrome.storage.local, keys)
    .pipe(
      map(data => {
        return keys
          // Revive retrieved data
          .reduce<Partial<Settings>>((accumulator, key) => {
            switch (key) {
              case STORAGE_KEYS.BADGE_ACTIVE:
              case STORAGE_KEYS.LAST_ACTIVE_TAB:
              case STORAGE_KEYS.LAST_SELECTED_ACTION:
              case STORAGE_KEYS.WIZARDS: {
                const value = data[key] || DEFAULT_SETTINGS[key];
                return update(accumulator, {[key]: {$set: value}});
              }

              case STORAGE_KEYS.BADGE_VISITED: {
                const value = data[key] && DateTime.fromMillis(data[key]) || DEFAULT_SETTINGS[key];
                return update(accumulator, {[key]: {$set: value}});
              }

              case STORAGE_KEYS.BIRTHDAYS: {
                const value = data[key] && data[key].map((event) => reviveBirthday(event)) || DEFAULT_SETTINGS[key];
                return update(accumulator, {[key]: {$set: value}});
              }

              default:
                throw new Error(`Should not have ${key} key`);
            }
          }, {});
      }),
    );
}

export function storeUserSettings(settings: Partial<Settings>): Observable<void>;
export function storeUserSettings(settings: Partial<Settings>, dontWait: boolean): void;
export function storeUserSettings(settings: Partial<Settings>, dontWait?: boolean) {
  const data =
    (Object.keys(settings) as Array<StorageKeyNames>)
      .reduce<Partial<StoredSettings>>((accumulator, key) => {
        switch (key) {
          case STORAGE_KEYS.BADGE_ACTIVE:
          case STORAGE_KEYS.LAST_ACTIVE_TAB:
          case STORAGE_KEYS.LAST_SELECTED_ACTION:
          case STORAGE_KEYS.WIZARDS:
            return update(accumulator, {[key]: {$set: settings[key]}});

          case STORAGE_KEYS.BADGE_VISITED:
            return update(accumulator, {[key]: {$set: settings[key].toMillis()}});

          case STORAGE_KEYS.BIRTHDAYS:
            return update(accumulator, {
              [key]: {
                $set: settings[key].map((event) => decayBirthday(event)),
              },
            });
          default:
            throw new Error(`Should not have ${key} key`);
        }
      }, {});

  if ('undefined' === typeof dontWait || false === dontWait) {
    return bindCallback<Partial<StoredSettings>>(setWrapper)(data);
  }

  chrome.storage.local.set(data);
}

export function clearStorage() {
  chrome.storage.local.clear();
}
