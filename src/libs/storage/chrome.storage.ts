import update from 'immutability-helper';
import { DateTime } from 'luxon';
import {
  bindCallback, firstValueFrom, from,
  Observable,
  Subscriber,
} from 'rxjs';
import { map } from 'rxjs/operators';
import {
  fakeName,
  isDevelopment,
  isFakeNames,
} from '../../constants';
import {
  RestoredBirthday,
  Settings,
  StoredBirthday,
  StoredSettings,
} from './storaged.types';

type AreaName = chrome.storage.AreaName;
type StorageChange = chrome.storage.StorageChange;

export const DEFAULT_SETTINGS: Settings = {
  activated: false,
  badgeVisited: DateTime.fromMillis(0),
  birthdays: [],
  donated: false,
  location: {
    pathname: '/',
    search: '',
    hash: '',
    state: undefined,
    //
    key: '',
  },
  modal: null,
  scanning: 0,
  scanSuccess: true,
  wizardsSettings: { csv: { format: 'dd/LL/yyyy' }, ics: { groupEvents: false } },
};

/**
 * Helper wrapper function to be used with rxjs bindCallback
 */
const setWrapper = <T>(parameters: T, callback: () => void) => chrome.storage.local.set(parameters, callback);

/**
 * Helper wrapper function for local.get to be used with rxjs bindCallback
 */
const getWrapper = <K extends Array<keyof StoredSettings>>(keys: K, callback: (items: StoredSettings) => void) => {
  return chrome.storage.local.get(keys, callback as () => any);
};

export function filterBirthdaysForDate(
  birthdays: Array<RestoredBirthday>,
  date: DateTime = DateTime.local(),
): Array<RestoredBirthday> {
  const { ordinal } = date;
  return birthdays.filter((r) => r.start.ordinal === ordinal);
}

/**
 * Store data to sessionStorage
 */
export function storeLastBadgeClicked(): Observable<void> {
  return storeUserSettings({
    badgeVisited: DateTime.local(),
  }, true);
}

function generateHref(uid: string, settings: number) {
  // Second bit is for custom-made contact they don't have a facebook link
  if (settings & (1 << 1)) {
    return undefined;
  }

  return `https://facebook.com/${uid}`;
}

export const reviveBirthday = (
  [name, uid, [day, month, year], misc, settings = 0]: StoredBirthday,
  useYear = 2020,
): RestoredBirthday => ({
  id: uid,
  name: isFakeNames && isDevelopment ? fakeName() : name,
  // use provided or 2020 since scanned birthdates was originally from 2020, because of the leap years
  start: DateTime.local(2020, month, day)
    .set({ year: useYear }), // Convert to current year
  href: generateHref(uid, settings),
  birthdate: { day, month, year },
  // Second bit is for hidden from export
  hidden: !!(settings & (1 << 0)),
});

/**
 * Callback function for chrome.storage.onChanged.addListener
 * listen to `local` AreaName
 * emits only for keys in `keyof Settings` types list
 */
function userSettingsListenerFunction(subscriber: Subscriber<Partial<Settings>>) {
  return (changes: { [key: string]: StorageChange }, areaName: AreaName) => {
    if (areaName !== 'local') {
      return;
    }

    const result = (Object.keys(changes) as Array<keyof Settings>)
      .reduce((accumulator, key) => {
        const { newValue } = changes[key];
        const value = reviveSettingsField(key, newValue);
        if (typeof value !== 'undefined') {
          return update(accumulator, { [key]: { $set: value } });
        }
        return accumulator;
      }, {} as Settings);

    // Emit next value
    subscriber.next(result);
  };
}

/**
 * Listen to UserSettings changes, only changed values emitted
 */
export function listenToUserSettings(): Observable<Partial<Settings>> {
  return new Observable((subscriber) => {
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
    case 'birthdays':
    case 'donated':
    case 'location':
    case 'modal':
    case 'scanning':
    case 'scanSuccess':
    case 'wizardsSettings':
      return value ?? DEFAULT_SETTINGS[key];

    case 'badgeVisited':
      return value && DateTime.fromMillis(value) || DEFAULT_SETTINGS[key];

    default:
      return undefined;
  }
};

/**
 * Fetch data from chrome.local storage
 * It has a bit of dirty tricks of typescript "as"... everything just to move one step toward this function to return right Pick from
 * Settings interface.
 *
 * Parameter is the array of properties names of Settings interface - values to fetch from storage
 *
 */
export function retrieveUserSettings<K extends Array<keyof Settings>, U extends Pick<Settings, K[number]>>(keys: K): Promise<U>;
export function retrieveUserSettings<K extends Array<keyof Settings>, U extends Pick<Settings, K[number]>>(keys: K, observableFlag: true): Observable<U>;
export function retrieveUserSettings<K extends Array<keyof Settings>, U extends Pick<Settings, K[number]>>(keys: K, callback: (c: U) => void): void;
export function retrieveUserSettings<K extends Array<keyof Settings>, U extends Pick<Settings, K[number]>>
(keys: K, callbackOrObservableFlag?: true | ((c: U) => void)): Observable<U> | Promise<U> | void {

  function mapStorageData(data: Settings) {
    const result = keys
      // Revive retrieved data
      .reduce((accumulator, key) => {
        const storedValue = data[key];
        const value = reviveSettingsField(key, storedValue);
        if (typeof value !== 'undefined') {
          return update(accumulator, { [key]: { $set: value } });
        }
        return accumulator;
      }, {} as Settings);
    return result as unknown as U;
  }

  if ('function' !== typeof callbackOrObservableFlag) {
    const observableReturn = from(chrome.storage.local.get(keys) as Promise<Settings>).pipe(map(mapStorageData));
    if (callbackOrObservableFlag === true) {
      return observableReturn;
    }
    return firstValueFrom(observableReturn);
  }


  chrome.storage.local.get(keys, (data) => {
    const formattedData = mapStorageData(data as Settings);
    callbackOrObservableFlag(formattedData);
  });
}

export function storeUserSettings(settings: Partial<Settings>): Promise<void>;
export function storeUserSettings(settings: Partial<Settings>, observableFlag: true): Observable<void>;
export function storeUserSettings(settings: Partial<Settings>, callback: () => void): void;
export function storeUserSettings(settings: Partial<Settings>, callbackOrObservableFlag?: true | (() => void)): Promise<void> | Observable<void> | void {
  const data = (Object.keys(settings) as Array<keyof Settings>)
    .reduce<Partial<StoredSettings>>((accumulator, key) => {
      switch (key) {
        case 'activated':
        case 'birthdays':
        case 'donated':
        case 'location':
        case 'modal':
        case 'scanning':
        case 'scanSuccess':
        case 'wizardsSettings':
          return update(accumulator, { [key]: { $set: settings[key] } });
        case 'badgeVisited':
          return update(accumulator, { [key]: { $set: settings[key].toMillis() } });
        default:
          throw new Error(`Should not have ${key} key`);
      }
    }, {});

  if (callbackOrObservableFlag === true) {
    return from(chrome.storage.local.set(data));
  }

  // If no callback is provided, return the Observable
  if (typeof callbackOrObservableFlag === "function") {
    chrome.storage.local.set(data, callbackOrObservableFlag);
  }

  return chrome.storage.local.set(data);
}

export function clearStorage() {
  chrome.storage.local.clear(() => null);
}
