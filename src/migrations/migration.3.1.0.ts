import { DateTime } from 'luxon';
import {
  Observable,
  of,
} from 'rxjs';
import {
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import {
  retrieveUserSettings,
  storeUserSettings,
} from '@/libs/storage/chrome.storage';
import { StoredBirthday } from '@/libs/storage/storaged.types';

/**
 * Starting from 3.1.0 additional functionality required contacts to have the birth-year
 * This fix is about to convert old stored contact into the new format
 *
 * For version < '3.1.0'
 *
 * @param version - previous version
 */
export function UPGRADE_TO_3_1_0(version: string): Observable<any> {
  if (!(version < '3.1.0')) {
    return of(false);
  }

  // get stored birthdays
  return retrieveUserSettings(['birthdays'], true)
    .pipe(
      map(({ birthdays }) => {
        const updated: Array<StoredBirthday> = (birthdays as unknown as Array<[string, number, string, number?]>)
          .map((birthdate) => {
            const date = DateTime.local(2020) // use 2020 since date was originally from 2020
              .set({ ordinal: birthdate[1] }); // Set ordinal of 2020
            return [
              birthdate[0], // name
              birthdate[2], // uid
              [date.day, date.month, null],
              null,
              birthdate[3] ?? 0,
            ];
          });
        return updated;
      }),
      switchMap((birthdays) => storeUserSettings({ birthdays }, true)),
      tap(() => {
        console.log('upgrade to 3.1.0 successful');
      }),
    );
}
