import {
  CREATE_CALENDAR_CSV,
  CREATE_CALENDAR_DELETE_ICS,
  CREATE_CALENDAR_ICS,
  CREATE_CALENDAR_JSON,
  CreateCalendarTypes,
} from './events/types';
import { CalendarCSV } from './formats/csv';
import { CalendarDeleteICS } from './formats/delete-ics';
import { CalendarICS } from './formats/ics';
import { CalendarJSON } from './formats/json';
import {
  CsvSettings,
  IcsSettings,
  StoredBirthday,
} from './storage/storaged.types';

export function downloadCalendar(type: typeof CREATE_CALENDAR_CSV, birthdays: Array<StoredBirthday>, options: CsvSettings): void ;
export function downloadCalendar(type: typeof CREATE_CALENDAR_JSON, birthdays: Array<StoredBirthday>): void ;
// tslint:disable-next-line:max-line-length
export function downloadCalendar(type: typeof CREATE_CALENDAR_ICS | typeof CREATE_CALENDAR_DELETE_ICS, birthdays: Array<StoredBirthday>, options: IcsSettings): void ;
export function downloadCalendar(type: CreateCalendarTypes, birthdays: Array<StoredBirthday>, options?: any): void {
  switch (type) {
    case CREATE_CALENDAR_CSV: {
      const calendar = new CalendarCSV(options);
      return calendar.save(calendar.generateCalendar(birthdays));
    }
    case CREATE_CALENDAR_JSON: {
      const calendar = new CalendarJSON();
      return calendar.save(calendar.generateCalendar(birthdays));
    }
    case CREATE_CALENDAR_ICS: {
      const calendar = new CalendarICS(options);
      return calendar.save(calendar.generateCalendar(birthdays));
    }
    case CREATE_CALENDAR_DELETE_ICS: {
      const calendar = new CalendarDeleteICS(options);
      return calendar.save(calendar.generateCalendar(birthdays));
    }
  }
}
