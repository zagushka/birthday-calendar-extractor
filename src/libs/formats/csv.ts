import { DateTime } from 'luxon';
import { CalendarBase } from '../base';
import {
  arrayToCSVRow,
  generatePreparedEventsForYears,
  PreparedEvent,
} from '../lib';
import { reviveBirthday } from '../storage/chrome.storage';
import {
  CsvSettings,
  StoredBirthday,
} from '../storage/storaged.types';

interface CsvFormattedEvent {
  name: string;
  start: string;
  href: string;
}

export class CalendarCSV extends CalendarBase<string, string> {
  readonly filename: string = 'birthday-calendar.csv';

  readonly fileMimeType: string = 'text/csv; charset=UTF-8';

  constructor(public settings: CsvSettings) {
    super();
  }

  formatEvent(event: PreparedEvent): CsvFormattedEvent {
    return {
      name: event.name,
      start: event.start.toFormat(this.settings.format), // 05/30/2020,
      href: event.href,
    };
  }

  generateCalendar(
    storedBirthdays: Array<StoredBirthday>,
    fromYear: number = DateTime.utc().year, // Current year
    tillYear: number = DateTime.utc().year, // Same year
  ) {
    /**
     * Prepare Events
     */

    const events = storedBirthdays.map(reviveBirthday);

    const currentDateTime = DateTime.utc().set({
      hour: 0, second: 0, minute: 0, millisecond: 0,
    });
    const preparedEvents = generatePreparedEventsForYears(events, fromYear, tillYear)
      // csv requires past birthdays to be converted to future
      .map((event) => {
        event.start = event.start < currentDateTime ? event.start.plus({ years: 1 }) : event.start;
        return event;
      })
      // Sort incrementally
      .sort((a, b) => a.start.toSeconds() - b.start.toSeconds());

    /**
     * Generate Calendar
     */
    const headers = arrayToCSVRow([
      'Subject',
      'Start Date',
      'All Day Event',
      'Description',
    ]);

    const rows = this.generateEvents(preparedEvents);

    // Prepend headers to rows
    rows.unshift(headers);

    return rows
      .join('\n') // Separate each element by line
      .replace(/\r?\n/g, '\r\n');
  }

  generateEvent(event: PreparedEvent): string {
    const formattedEvent = this.formatEvent(event);

    const preEscaped = [
      // There is unicode cake character before event.name, you may not see it in you editor
      `${formattedEvent.name}`, // `Subject,`,
      formattedEvent.start, // `Start Date,`,
      'true', // `All Day Event,`,
      formattedEvent.href ? `This is <a href='${formattedEvent.href}'>${formattedEvent.name}</a> birthday!` : `This is ${formattedEvent.name} birthday!`, // Description,`,
    ];

    return arrayToCSVRow(preEscaped);
  }
}
