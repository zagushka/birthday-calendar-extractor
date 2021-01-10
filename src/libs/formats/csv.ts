import * as FileSaver from 'file-saver';
import { DateTime } from 'luxon';
import { CsvSettings } from '../../context/settings.context';
import { CalendarBase } from '../base';
import {
  arrayToCSVRow,
  generatePreparedEventsForYears,
  PreparedEvent,
  RawEvent,
} from '../lib';

interface CsvFormattedEvent {
  name: string;
  start: string;
  href: string;
}

export class CalendarCSV extends CalendarBase<{}, string, string> {
  readonly filename: string = 'birthday-calendar.csv';
  readonly fileMimeType: string = 'text/csv; charset=UTF-8';

  constructor(public settings: CsvSettings) {
    super();
  }

  save(calendarData: string) {
    const blob = new Blob([calendarData], {endings: 'transparent', type: this.fileMimeType});
    FileSaver.saveAs(blob, this.filename, {autoBom: true});
  }

  formatEvent(event: PreparedEvent): CsvFormattedEvent {
    return {
      name: event.name,
      start: event.start.toFormat(this.settings.format), // 05/30/2020,
      href: event.href,
    };
  }

  generateCalendar(
    events: Array<RawEvent>,
    fromYear: number = DateTime.utc().year, // Current year
    tillYear: number = DateTime.utc().year, // Same year
  ) {

    /**
     * Prepare Events
     */
    const currentDateTime = DateTime.utc().set({hour: 0, second: 0, minute: 0, millisecond: 0});
    const preparedEvents = generatePreparedEventsForYears(events, fromYear, tillYear)
      // csv requires past birthdays to be converted to future
      .map(event => {
        event.start = event.start < currentDateTime ? event.start.plus({year: 1}) : event.start;
        return event;
      })
      // Sort incrementally
      .sort((a, b) => a.start.toSeconds() - b.start.toSeconds());

    /**
     * Generate Calendar
     */
    const headers = arrayToCSVRow([
      `Subject`,
      `Start Date`,
      `All Day Event`,
      `Description`,
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
      `This is <a href='${formattedEvent.href}'>${formattedEvent.name}</a> birthday!`, // Description,`,
    ];

    return arrayToCSVRow(preEscaped);
  }
}

