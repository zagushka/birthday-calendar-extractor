import update from 'immutability-helper';
import { DateTime } from 'luxon';
import {
  bindCallback,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';
import {
  WIZARD_NAMES,
} from '../../constants';

import { WizardsSettings } from '../../context/settings.context';

export interface Settings {
  badgeActive: boolean;
  lastSelectedWizard: typeof WIZARD_NAMES[keyof typeof WIZARD_NAMES];
  wizardSettings: WizardsSettings;
  badgeVisited: DateTime;
  birthdays: Array<RestoredBirthday>;
}

export interface StoredSettings {
  badgeActive: boolean;
  lastSelectedWizard: typeof WIZARD_NAMES[keyof typeof WIZARD_NAMES];
  wizardSettings: WizardsSettings;
  badgeVisited: number;
  birthdays: Array<StoredBirthday>;
}

export type StoredBirthday = [string, number, string];

export interface RestoredBirthday {
  name: string;
  href: string;
  start: DateTime
}

export const DEFAULT_SETTINGS: Settings = {
  badgeActive: false,
  badgeVisited: DateTime.fromMillis(0),
  birthdays: [],
  lastSelectedWizard: WIZARD_NAMES.CREATE_ICS,
  wizardSettings: {csv: {format: 'dd/LL/yyyy'}, ics: {allDayEvent: false, groupEvents: false}},
};


/**
 * Helper wrapper function to be used with rxjs bindCallback
 */
const setWrapper = <T>(parameters: T, callback: () => void) => chrome.storage.local.set(parameters, callback);

/**
 * Helper wrapper function for local.get to be used with rxjs bindCallback
 */
const getWrapper =
  <K extends Array<keyof StoredSettings>>(keys: K, callback: (items: StoredSettings) => void) => {
    chrome.storage.local.get(keys, callback as () => any);
  };

/**
 * Fetch all birthdays form local storage and filter for today's
 */

export function getBirthdaysForDate(date: DateTime): Observable<Array<RestoredBirthday>> {
  return retrieveUserSettings(['birthdays'])
    .pipe(
      map(({birthdays}) => filterBirthdaysForDate(birthdays, date)),
    );
}

export function filterBirthdaysForDate(birthdays: Array<RestoredBirthday>, date: DateTime = DateTime.local()): Array<RestoredBirthday> {
  const ordinal = date.ordinal;
  return birthdays.filter(r => r.start.ordinal === ordinal);
}


/**
 * Store data to sessionStorage
 */
export function storeLastBadgeClicked(): Observable<void> {
  return storeUserSettings({
    badgeVisited: DateTime.local(),
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

/**
 * Fetch data from chrome.local storage
 * It have a bit dirty tricks of typescript "as"... everything just to move one step toward this function to return right Pick from
 * Settings interface.
 *
 * Parameter is the array of properties names of Settings interface - values to fetch from storage
 *
 */
export function retrieveUserSettings<K extends Array<keyof Settings>, U extends Pick<Settings, K[number]>>(keys: K): Observable<U> {
  const r = bindCallback(getWrapper)(keys)
    .pipe(
      map(data => {
        const result = keys
          // Revive retrieved data
          .reduce((accumulator, key) => {
            switch (key) {
              case 'badgeActive':
              case 'lastSelectedWizard':
              case 'wizardSettings': {
                const value = data[key] || DEFAULT_SETTINGS[key];
                return update(accumulator, {[key]: {$set: value}});
              }

              case 'badgeVisited': {
                const value = data[key] && DateTime.fromMillis(data[key]) || DEFAULT_SETTINGS[key];
                return update(accumulator, {[key]: {$set: value}});
              }

              case 'birthdays': {
                const value = data[key] && data[key].map((event) => reviveBirthday(event)) || DEFAULT_SETTINGS[key];
                return update(accumulator, {[key]: {$set: value}});
              }

              default:
                throw new Error(`Should not have ${key} key`);
            }
          }, {} as Settings); // <- Dirty trick

        return result as unknown as U;
      }),
    );

  return r as unknown as Observable<U>; // <- Another dirty trick
}

export function storeUserSettings(settings: Partial<Settings>): Observable<void>;
export function storeUserSettings(settings: Partial<Settings>, dontWait: boolean): void;
export function storeUserSettings(settings: Partial<Settings>, dontWait?: boolean) {
  const data =
    (Object.keys(settings) as Array<keyof Settings>)
      .reduce<Partial<StoredSettings>>((accumulator, key) => {
        switch (key) {
          case 'badgeActive':
          case 'lastSelectedWizard':
          case 'wizardSettings':
            return update(accumulator, {[key]: {$set: settings[key]}});

          case 'badgeVisited':
            return update(accumulator, {[key]: {$set: settings[key].toMillis()}});

          case 'birthdays':
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
