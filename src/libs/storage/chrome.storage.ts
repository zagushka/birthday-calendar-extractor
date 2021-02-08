import update from 'immutability-helper';
import { DateTime } from 'luxon';
import {
  bindCallback,
  Observable,
  Subscriber,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { WIZARD_NAMES } from '../../constants';

import { WizardsSettings } from '../../context/settings.context';
import AreaName = chrome.storage.AreaName;
import StorageChange = chrome.storage.StorageChange;

export interface Settings {
  activated: boolean;
  scanning: boolean;
  scanSuccess: boolean;
  lastSelectedWizard: typeof WIZARD_NAMES[keyof typeof WIZARD_NAMES];
  wizardSettings: WizardsSettings;
  badgeVisited: DateTime;
  birthdays: Array<RestoredBirthday>;
}

export interface StoredSettings {
  activated: boolean;
  scanning: boolean;
  scanSuccess: boolean;
  lastSelectedWizard: typeof WIZARD_NAMES[keyof typeof WIZARD_NAMES];
  wizardSettings: WizardsSettings;
  badgeVisited: number;
  birthdays: Array<StoredBirthday>;
}

export type StoredBirthday = [string, number, string];

export interface RestoredBirthday {
  name: string;
  href: string;
  start: DateTime;
}

export const DEFAULT_SETTINGS: Settings = {
  activated: false,
  scanning: false,
  scanSuccess: true,
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
 * Callback function for chrome.storage.onChanged.addListener
 * listen to `local` AreaName
 * emits only for keys in `keyof Settings` types list
 */
const userSettingsListenerFunction =
  (subscriber: Subscriber<Partial<Settings>>) => (changes: { [key: string]: StorageChange }, areaName: AreaName) => {
    if ('local' !== areaName) {
      return;
    }

    const result = (Object.keys(changes) as Array<keyof Settings>)
      .reduce((accumulator, key) => {
        const {newValue} = changes[key];
        const value = reviveSettingsField(key, newValue);
        if (undefined !== typeof value) {
          return update(accumulator, {[key]: {$set: value}});
        }
        return accumulator;
      }, {} as Settings); // <- Dirty trick)

    // Emit next value
    subscriber.next(result);
  };

/**
 * Listen to UserSettings changes, only changed values emitted
 */
export function listenToUserSettings(): Observable<Partial<Settings>> {
  return new Observable(subscriber => {
    // Create Listener function
    const listenerFunction = userSettingsListenerFunction(subscriber);

    // Listen to the changes
    chrome.storage.onChanged.addListener(listenerFunction);

    // Return unsubscribe function
    return () => chrome.storage.onChanged.removeListener(listenerFunction);
  });
}

/**
 * Revive fetched from the storage data field
 *
 */
const reviveSettingsField = (key: keyof Settings, value: any): any => {
  switch (key) {
    case 'activated':
    case 'scanning':
    case 'scanSuccess':
    case 'lastSelectedWizard':
    case 'wizardSettings': {
      return value ?? DEFAULT_SETTINGS[key];
    }

    case 'badgeVisited': {
      return value && DateTime.fromMillis(value) || DEFAULT_SETTINGS[key];
    }

    case 'birthdays': {
      return value && value.map((event: StoredBirthday) => reviveBirthday(event)) || DEFAULT_SETTINGS[key];
    }

    default:
      return undefined;
  }
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
            const storedValue = data[key];
            const value = reviveSettingsField(key, storedValue);
            if (undefined !== typeof value) {
              return update(accumulator, {[key]: {$set: value}});
            }
            return accumulator;
          }, {} as Settings);

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
          case 'activated':
          case 'scanning':
          case 'scanSuccess':
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
