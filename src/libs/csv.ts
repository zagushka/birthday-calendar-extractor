import { DateTime } from 'luxon';
import { CalendarBase } from './base';
import {
  BakedEvent,
  RawEvent,
} from './lib';


export class CalendarCSV extends CalendarBase<{}, string, string> {
  readonly filename: string = 'birthday-calendar.csv';
  readonly fileMimeType: string = 'text/csv; charset=UTF-8';

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
    ].join(',') +
      this.generateEvents(events, tillYear).join('\n')
        .replace(/\r?\n/g, '\r\n');
  }

  generateEvent(event: BakedEvent) {
    const formattedEvent = this.formatEvent(event);
    return [
      // There is unicode cake character before event.name, you may not see it in you editor
      `🎂 ${formattedEvent.name}`, // `Subject,`,
      formattedEvent.start, // `Start Date,`,
      // `Start Time,`,
      // event.end, // `End Date,`,
      // `End Time,`,
      'true', // `All Day Event,`,
      `This is <a href='${formattedEvent.href}'>${formattedEvent.name}</a> birthday!`, // Description,`,
      // `Location,`,
      'true', // `Private`,
    ]
      .map(col => '"' + col.replace(/"/g, '""') + '"')
      .join(',');
  }
}

