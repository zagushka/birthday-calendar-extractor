import { Subscriber } from 'rxjs';
import { PreparedEvent } from './lib';
import { StoredBirthday } from './storage/storaged.types';

export abstract class CalendarBase<Formatted, GeneratedEvent, GeneratedCalendar> {
  abstract readonly filename: string;
  abstract readonly fileMimeType: string;

  abstract generateCalendar(events: Array<StoredBirthday>, fromYear?: number, tillYear?: number): GeneratedCalendar;

  abstract generateEvent(event: PreparedEvent): GeneratedEvent;

  abstract formatEvent(event: PreparedEvent): any;

  generateEvents(events: Array<PreparedEvent>): Array<GeneratedEvent> {
    return events.map(e => this.generateEvent(e)); // Generate final events
  }

  save(calendarData: string, subscriber?: Subscriber<any>) {
    const url = URL.createObjectURL(
      new Blob([calendarData], {endings: 'transparent', type: this.fileMimeType}),
    );
    chrome.downloads.download({url, filename: this.filename},
      (downloadId) => {
        if (!!subscriber) {
          if ('undefined' === typeof downloadId) {
            return subscriber.error({message: 'FAILED TO DOWNLOAD FILE', error: chrome.runtime.lastError});
          }
          subscriber.next(true);
          subscriber.complete();
        }
      },
    );
  }
}
