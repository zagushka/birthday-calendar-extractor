import {
  Observable,
  of,
} from 'rxjs';
import { RawEvent } from '../lib';

export class TempStorage {
  static BIRTHDAYS: Map<string, RawEvent>;

  static storeBirthdays(birthdays: Map<string, RawEvent>) {
    TempStorage.BIRTHDAYS = birthdays;
  }

  static retrieveBirthdays(): Observable<Map<string, RawEvent>> {
    return of(TempStorage.BIRTHDAYS);
  }
}
