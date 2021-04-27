import { DateTime } from 'luxon';
import {
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import {
  retrieveUserSettings,
  storeUserSettings,
} from '../libs/storage/chrome.storage';
import { StoredBirthday } from '../libs/storage/storaged.types';

export const UPGRADE_TO_3_1_0 = () => {
  // get stored birthdays
  return retrieveUserSettings(['birthdays'])
    .pipe(
      map(({birthdays}) => {
        const updated: Array<StoredBirthday> = (birthdays as unknown as Array<[string, number, string, number?]>)
          .map((birthdate) => {
            const date = DateTime.local(2020) // use 2020 since date was originally from 2020
              .set({ordinal: birthdate[1]}); // Set ordinal of 2020
            return [
              birthdate[0], // name
              birthdate[2], // uid
              [date.day, date.month, date.year],
              null,
              birthdate[3] ?? 0,
            ];
          });
        return updated;
      }),
      switchMap(birthdays => storeUserSettings({birthdays}, true)),
      tap((b) => {
        console.log('upgrade to 3.1.0 successful');
      }),
    );
};
