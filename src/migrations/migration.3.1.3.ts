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
} from '../libs/storage/chrome.storage';
import {
  STORED_BIRTHDAY,
  StoredBirthday,
} from '../libs/storage/storaged.types';

/**
 * Because of the bug in 3.1.0 with migration to new storage format
 * all contacts without the `year` field were replaced with 2020.
 * This migration fix that issue and replace all the birth-dates year 2020 with null
 *
 * For version >= '3.1.0' && version < '3.1.3'
 *
 * @param version - previous Version
 */
export function UPGRADE_TO_3_1_3(version: string): Observable<any> {
  if (!(version >= '3.1.0' && version < '3.1.3')) {
    return of(false);
  }
  return retrieveUserSettings(['birthdays'], true)
    .pipe(
      map(({ birthdays }) => {
        const updated: Array<StoredBirthday> = birthdays
          .map((birthdate) => {
            if (birthdate[STORED_BIRTHDAY.BIRTH_DATE][2] === 2020) {
              birthdate[STORED_BIRTHDAY.BIRTH_DATE][2] = null;
            }
            return birthdate;
          });
        return updated;
      }),
      switchMap((birthdays) => storeUserSettings({ birthdays }, true)),
      tap(() => {
        console.log('upgrade to 3.1.3 successful');
      }),
    );
}
