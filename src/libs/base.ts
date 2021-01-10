import {
  PreparedEvent,
  RawEvent,
} from './lib';

export abstract class CalendarBase<Formatted, GeneratedEvent, GeneratedCalendar> {
  abstract readonly filename: string;
  abstract readonly fileMimeType: string;

  abstract save(calendarData: GeneratedCalendar): void;

  abstract generateCalendar(events: Array<RawEvent>, fromYear?: number, tillYear?: number): GeneratedCalendar;

  abstract generateEvent(event: PreparedEvent): GeneratedEvent;

  abstract formatEvent(event: PreparedEvent): any;

  generateEvents(events: Array<PreparedEvent>): Array<GeneratedEvent> {
    return events.map(e => this.generateEvent(e)); // Generate final events
  }
}
