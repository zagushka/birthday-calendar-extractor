import { Observable } from 'rxjs';
import { downloadFile } from './download-file';
import {
  CREATE_CALENDAR_CSV,
  CREATE_CALENDAR_DELETE_ICS,
  CREATE_CALENDAR_ICS,
  CREATE_CALENDAR_JSON,
  CREATE_CSV_DATA,
} from './events/types';
import { CalendarCSV } from './formats/csv';
import { calendarCSVData } from './formats/csv-data';
import { CalendarDeleteICS } from './formats/delete-ics';
import { CalendarICS } from './formats/ics';
import { CalendarJSON } from './formats/json';
import {
  CsvSettings,
  IcsSettings,
  StoredBirthday,
} from './storage/storaged.types';

export function downloadCalendar(type: typeof CREATE_CALENDAR_CSV, birthdays: Array<StoredBirthday>, options: CsvSettings): Observable<any>;
export function downloadCalendar(type: typeof CREATE_CALENDAR_JSON, birthdays: Array<StoredBirthday>): Observable<any>;
// tslint:disable-next-line:max-line-length
export function downloadCalendar(type: typeof CREATE_CALENDAR_ICS | typeof CREATE_CALENDAR_DELETE_ICS, birthdays: Array<StoredBirthday>, options: IcsSettings): Observable<any>;
export function downloadCalendar(type: any, birthdays: Array<StoredBirthday>, options?: any): Observable<any> {
  return new Observable(subscriber => {
    switch (type) {
      case CREATE_CALENDAR_CSV: {
        const calendar = new CalendarCSV(options);
        calendar.save(calendar.generateCalendar(birthdays), subscriber);
        break;
      }
      case CREATE_CSV_DATA: {
        const calendar = calendarCSVData(birthdays);
        downloadFile(calendar, {mimeType: 'text/csv; charset=UTF-8', filename: 'facebook-dates-of-birth.csv'})
          .subscribe(subscriber);
        break;
      }
      case CREATE_CALENDAR_JSON: {
        const calendar = new CalendarJSON();
        calendar.save(calendar.generateCalendar(birthdays), subscriber);
        break;
      }
      case CREATE_CALENDAR_ICS: {
        const calendar = new CalendarICS(options);
        calendar.save(calendar.generateCalendar(birthdays), subscriber);
        break;
      }
      case CREATE_CALENDAR_DELETE_ICS: {
        const calendar = new CalendarDeleteICS(options);
        calendar.save(calendar.generateCalendar(birthdays), subscriber);
        break;
      }
      default:
        subscriber.error({message: `WRONG EXPORT TYPE '${type}'`});
    }

    return () => subscriber.complete();
  });
}
