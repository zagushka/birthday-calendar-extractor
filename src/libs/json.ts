import * as FileSaver from 'file-saver';
import { DateTime } from 'luxon';
import { CalendarBase } from './base';
import {
  PreparedEvent,
  RawEvent,
} from './lib';


export class CalendarJSON extends CalendarBase<{}, {}, {}> {
  readonly filename: string = 'birthday-calendar.json';
  readonly fileMimeType: string = 'application/json; charset=UTF-8';

  save(calendarData: string) {
    const blob = new Blob([calendarData], {endings: 'transparent', type: this.fileMimeType});
    FileSaver.saveAs(blob, this.filename, {autoBom: true});
  }

  formatEvent(event: PreparedEvent) {
    return [
      event.name,
      Math.round(event.start.toSeconds() / 86400), // Returns the epoch days
      // Remove https://facebook.com/ to reduce the size, using indexOf since facebook subdomain can vary
      event.href.slice(event.href.indexOf('/', 8) + 1), // 8 = 'https://'.length
    ];

    return {
      name: event.name,
      start: event.start.toFormat('LL/dd/yyyy'), // 05/30/2020
      href: event.href,
    };
  }

  generateCalendar(
    events: Array<RawEvent>,
    fromYear: number = DateTime.utc().year, // Current year
    tillYear: number = DateTime.utc().year, // Same year
  ) {
    const preparedEvents = this.generatePreparedEventsForYears(events, fromYear, tillYear);
    return JSON.stringify(this.generateEvents(preparedEvents));
  }

  generateEvent(event: PreparedEvent) {
    return this.formatEvent(event);
  }
}

