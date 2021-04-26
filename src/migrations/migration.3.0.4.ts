import { DateTime } from 'luxon';
import {
  map,
  tap,
} from 'rxjs/operators';
import { retrieveUserSettings } from '../libs/storage/chrome.storage';
import { StoredBirthday } from '../libs/storage/storaged.types';

export const UPGRADE_TO_3_0_4 = () => {
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
              [null, date.month, date.day],
              null,
              birthdate[3] ?? 0,
            ];
          });
        return updated;
      }),
      // switchMap(birthdays => storeUserSettings({birthdays}, true)),
      tap((b) => {
        console.log('upgrade to 3.0.4 successful');
      }),
    );
};
