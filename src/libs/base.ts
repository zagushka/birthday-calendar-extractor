import {
  PreparedEvent,
  prepareEvent,
  RawEvent,
} from './lib';

export interface CalendarGenerator<Formatted, GeneratedEvent, GeneratedCalendar> {
  readonly filename: string;
  readonly fileMimeType: string;

  generateCalendar(events: Array<RawEvent>, tillYear: number): GeneratedCalendar;

  generateEvents(events: Array<RawEvent>, fromYear: number, tillYear: number): Array<GeneratedEvent>;

  generateEvent(event: PreparedEvent): GeneratedEvent;

  formatEvent(event: PreparedEvent): Formatted;
}

export abstract class CalendarBase<F, GE, GC> implements CalendarGenerator<F, GE, GC> {
  abstract readonly filename: string;
  abstract readonly fileMimeType: string;

  abstract save(calendarData: string): void;

  abstract generateCalendar(events: Array<RawEvent>, fromYear?: number, tillYear?: number): GC;

  abstract generateEvent(event: PreparedEvent): GE;

  abstract formatEvent(event: PreparedEvent): F;

  generateEvents(events: Array<RawEvent>, fromYear: number, tillYear: number): Array<GE> {
    const result: Array<PreparedEvent> = [];

    do {
      events.forEach(event => {
        const baked = prepareEvent(event, fromYear);
        if (baked) {
          result.push(baked);
        }
      });
      fromYear++;
    } while (tillYear >= fromYear);

    return result
      // Sort event
      .sort((a, b) => b.start.toSeconds() - a.start.toSeconds())
      .map(e => this.generateEvent(e));
  }
}
