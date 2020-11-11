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

// tslint:disable-next-line:max-line-length
export abstract class CalendarBase<Formatted, GeneratedEvent, GeneratedCalendar> implements CalendarGenerator<Formatted, GeneratedEvent, GeneratedCalendar> {
  abstract readonly filename: string;
  abstract readonly fileMimeType: string;

  abstract save(calendarData: GeneratedCalendar): void;

  abstract generateCalendar(events: Array<RawEvent>, fromYear?: number, tillYear?: number): GeneratedCalendar;

  abstract generateEvent(event: PreparedEvent): GeneratedEvent;

  abstract formatEvent(event: PreparedEvent): Formatted;

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

  generateEvents(events: Array<PreparedEvent>): Array<GeneratedEvent> {
    return events.map(e => this.generateEvent(e)); // Generate final events
  }
}
