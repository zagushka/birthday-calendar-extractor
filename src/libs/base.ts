import * as FileSaver from 'file-saver';
import { DateTime } from 'luxon';
import {
  BakedEvent,
  bakeEvent,
  RawEvent,
} from './lib';

export interface CalendarGenerator {
  readonly filename: string;
  readonly fileMimeType: string;

  generateCalendar(events: Array<RawEvent>, tillYear: number): string;

  generateEvents(events: Array<RawEvent>, tillYear: number): string;

  generateEvent(event: BakedEvent): string;

  formatEvent(event: BakedEvent): {};
}

export abstract class CalendarBase implements CalendarGenerator {
  abstract readonly filename: string;
  abstract readonly fileMimeType: string;

  abstract generateCalendar(events: Array<RawEvent>, tillYear?: number): string;

  abstract generateEvent(event: BakedEvent): string;

  abstract formatEvent(event: BakedEvent): {};

  generateAndSave(events: Array<RawEvent>) {
    const calendarData = this.generateCalendar(events);
    const blob = new Blob([calendarData], {endings: 'transparent', type: this.fileMimeType});
    FileSaver.saveAs(blob, this.filename, {autoBom: true});
  }

  generateEvents(events: Array<RawEvent>, tillYear: number) {
    let year = DateTime.local().year;
    const result: Array<BakedEvent> = [];

    do {
      events.forEach(event => {
        const baked = bakeEvent(event, year);
        if (baked) {
          result.push(baked);
        }
      });
      year++;
    } while (tillYear >= year);

    return result.map(e => this.generateEvent(e)).join('\n');
  }
}
