import * as FileSaver from 'file-saver';
import { DateTime } from 'luxon';
import {
  BakedEvent,
  bakeEvent,
  RawEvent,
} from './lib';

export interface CalendarGenerator<Formatted, GeneratedEvent, GeneratedCalendar> {
  readonly filename: string;
  readonly fileMimeType: string;

  generateCalendar(events: Array<RawEvent>, tillYear: number): GeneratedCalendar;

  generateEvents(events: Array<RawEvent>, tillYear: number): Array<GeneratedEvent>;

  generateEvent(event: BakedEvent): GeneratedEvent;

  formatEvent(event: BakedEvent): Formatted;
}

export abstract class CalendarBase<F, GE, GC> implements CalendarGenerator<F, GE, GC> {
  abstract readonly filename: string;
  abstract readonly fileMimeType: string;

  abstract generateCalendar(events: Array<RawEvent>, tillYear?: number): GC;

  abstract generateEvent(event: BakedEvent): GE;

  abstract formatEvent(event: BakedEvent): F;

  // generateAndSave(calendarData: GC) {
  //   const blob = new Blob([calendarData], {endings: 'transparent', type: this.fileMimeType});
  //   FileSaver.saveAs(blob, this.filename, {autoBom: true});
  // }

  generateEvents(events: Array<RawEvent>, tillYear: number): Array<GE> {
    let year = DateTime.utc().year;
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

    return result.map(e => this.generateEvent(e));
  }
}
