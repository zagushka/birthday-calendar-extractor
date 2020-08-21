import {
  BakedEvent,
  bakeEvent,
  RawEvent,
} from './lib';

export interface CalendarGenerator<Formatted, GeneratedEvent, GeneratedCalendar> {
  readonly filename: string;
  readonly fileMimeType: string;

  generateCalendar(events: Array<RawEvent>, tillYear: number): GeneratedCalendar;

  generateEvents(events: Array<RawEvent>, fromYear: number, tillYear: number): Array<GeneratedEvent>;

  generateEvent(event: BakedEvent): GeneratedEvent;

  formatEvent(event: BakedEvent): Formatted;
}

export abstract class CalendarBase<F, GE, GC> implements CalendarGenerator<F, GE, GC> {
  abstract readonly filename: string;
  abstract readonly fileMimeType: string;

  abstract save(calendarData: string): void;

  abstract generateCalendar(events: Array<RawEvent>, fromYear?: number, tillYear?: number): GC;

  abstract generateEvent(event: BakedEvent): GE;

  abstract formatEvent(event: BakedEvent): F;

  generateEvents(events: Array<RawEvent>, fromYear: number, tillYear: number): Array<GE> {
    const result: Array<BakedEvent> = [];

    do {
      events.forEach(event => {
        const baked = bakeEvent(event, fromYear);
        if (baked) {
          result.push(baked);
        }
      });
      fromYear++;
    } while (tillYear >= fromYear);

    return result.map(e => this.generateEvent(e));
  }
}
