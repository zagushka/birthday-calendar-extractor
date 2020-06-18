import { DateTime } from 'luxon';
import { CalendarBase } from './base';
import {
  BakedEvent,
  RawEvent,
} from './lib';


export class CalendarJSON extends CalendarBase<{}, {}, {}> {
  readonly filename: string = 'birthday-calendar.json';
  readonly fileMimeType: string = 'application/json; charset=UTF-8';

  formatEvent(event: BakedEvent) {
    return {
      name: event.name,
      start: event.start.toFormat('LL/dd/yyyy'), // 05/30/2020
      href: event.href,
    };
  }

  generateCalendar(
    events: Array<RawEvent>,
    tillYear: number = DateTime.local().plus({year: 0}).year,
  ) {
    return this.generateEvents(events, tillYear);
  }

  generateEvent(event: BakedEvent) {
    return this.formatEvent(event);
  }
}

