import * as FileSaver from 'file-saver';
import { DateTime } from 'luxon';
import { CalendarBase } from './base';
import {
  PreparedEvent,
  RawEvent,
} from './lib';

export class CalendarCSV extends CalendarBase<{}, string, string> {
  readonly filename: string = 'birthday-calendar.csv';
  readonly fileMimeType: string = 'text/csv; charset=UTF-8';

  save(calendarData: string) {
    const blob = new Blob([calendarData], {endings: 'transparent', type: this.fileMimeType});
    FileSaver.saveAs(blob, this.filename, {autoBom: true});
  }

  formatEvent(event: PreparedEvent) {
    // csv requires past birthdays to be converted to future
    const start = event.start < DateTime.utc() ? event.start.plus({year: 1}) : event.start;

    return {
      name: event.name,
      start: start.toFormat('LL/dd/yyyy'), // 05/30/2020,
      href: event.href,
    };
  }

  generateCalendar(
    events: Array<RawEvent>,
    fromYear: number = DateTime.utc().year, // Current year
    tillYear: number = DateTime.utc().year, // Same year
  ) {
    return [
        `Subject`,
        `Start Date`,
        // `Start Time,`,
        // `End Date,`,
        // `End Time,`,
        `All Day Event`,
        `Description`,
        // `Location,`,
        // `Private`,
      ].join(',') + '\n' +
      this.generateEvents(events, fromYear, tillYear).join('\n')
        .replace(/\r?\n/g, '\r\n');
  }

  generateEvent(event: PreparedEvent) {
    const formattedEvent = this.formatEvent(event);

    const preescaped = [
      // There is unicode cake character before event.name, you may not see it in you editor
      `${formattedEvent.name}`, // `Subject,`,
      formattedEvent.start, // `Start Date,`,
      // `Start Time,`,
      // event.end, // `End Date,`,
      // `End Time,`,
      'true', // `All Day Event,`,
      `This is <a href='${formattedEvent.href}'>${formattedEvent.name}</a> birthday!`, // Description,`,
      // `Location,`,
      // 'true', // `Private`,
    ]
      .map(col => '"' + col.replace(/"/g, '""') + '"')
      .join(',');
  }
}

