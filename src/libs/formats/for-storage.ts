import { CalendarBase } from '../base';
import {
  PreparedEvent,
  RawEvent,
} from '../lib';

export class CalendarForStorage extends CalendarBase<{}, {}, {}> {
  readonly filename: string;
  readonly fileMimeType: string;

  save(calendarData: string) {
    // Store the data
  }

  formatEvent(event: PreparedEvent) {
    return [
      event.name,
      event.start.ordinal, // Day of the year in 2020
      // Remove https://facebook.com/ to reduce the size, using indexOf since facebook subdomain can vary
      event.href.slice(event.href.indexOf('/', 8) + 1), // 8 = 'https://'.length
    ];
  }

  generateCalendar(
    events: Array<RawEvent>,
    fromYear: number = 2020, // Use 2020 (leap year)
    tillYear: number = 2020, // Same year
  ) {
    const preparedEvents = this.generatePreparedEventsForYears(events, fromYear, tillYear);
    return this.generateEvents(preparedEvents);
  }

  generateEvent(event: PreparedEvent) {
    return this.formatEvent(event);
  }
}

