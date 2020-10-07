import {
  PreparedEvent,
  prepareEvent,
  RawEvent,
} from './lib';

export interface CalendarGenerator<Formatted, GeneratedEvent, GeneratedCalendar> {
  readonly filename: string;
  readonly fileMimeType: string;

  generateCalendar(events: Array<RawEvent>, tillYear: number): GeneratedCalendar;

  generateEvents(events: Array<PreparedEvent>): Array<GeneratedEvent>;

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

  /**
   * Generate Array of events for required years range
   */
  protected generatePreparedEventsForYears(events: Array<RawEvent>, fromYear: number, tillYear: number) {
    const result: Array<PreparedEvent> = [];

    do {
      events.forEach(event => {
        const preparedEvent = prepareEvent(event, fromYear);
        if (preparedEvent) {
          result.push(preparedEvent);
        }
      });
      fromYear++;
    } while (tillYear >= fromYear);

    return result;
  }

  generateEvents(events: Array<PreparedEvent>): Array<GE> {
    return events.map(e => this.generateEvent(e)); // Generate final events
  }
}
