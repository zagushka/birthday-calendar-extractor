import { DateTime } from 'luxon';
import { CalendarBase } from '../base';
import {
  generatePreparedEventsForYears,
  PreparedEvent,
} from '../lib';
import { reviveBirthday } from '../storage/chrome.storage';
import { StoredBirthday } from '../storage/storaged.types';

export class CalendarJSON extends CalendarBase<{}, {}, {}> {
  readonly filename: string = 'birthday-calendar.json';
  readonly fileMimeType: string = 'application/json; charset=UTF-8';

  save(calendarData: string) {
    const url = URL.createObjectURL(
      new Blob([calendarData], {endings: 'transparent', type: this.fileMimeType}),
    );
    chrome.downloads.download({url, filename: this.filename},
      (err) => {
        console.log('Error downloading file ', err, chrome.runtime.lastError);
      },
    );
  }

  formatEvent(event: PreparedEvent) {
    return {
      name: event.name,
      start: event.start.toFormat('LL/dd/yyyy'), // 05/30/2020
      href: event.href,
    };
  }

  generateCalendar(
    storedBirthdays: Array<StoredBirthday>,
    fromYear: number = DateTime.utc().year, // Current year
    tillYear: number = DateTime.utc().year, // Same year
  ) {
    const events = storedBirthdays.map(reviveBirthday);
    const preparedEvents = generatePreparedEventsForYears(events, fromYear, tillYear);
    return JSON.stringify(this.generateEvents(preparedEvents));
  }

  generateEvent(event: PreparedEvent) {
    return this.formatEvent(event);
  }
}

