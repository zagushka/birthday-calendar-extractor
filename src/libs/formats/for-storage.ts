import { DateTime } from 'luxon';
import { CalendarBase } from '../base';
import {
  BirthdaysScanComplete,
  updateBadgeAction,
} from '../events/actions';
import { sendMessage } from '../events/events';
import {
  generatePreparedEventsForYears,
  PreparedEvent,
} from '../lib';
import {
  RestoredBirthday,
  storeUserSettings,
} from '../storage/chrome.storage';

export class CalendarForStorage extends CalendarBase<{ name: string; start: DateTime; href: string },
  { name: string; start: DateTime; href: string },
  Array<{ name: string; start: DateTime; href: string }>> {
  readonly filename: string;
  readonly fileMimeType: string;

  save(calendarData: Array<{ name: string; start: DateTime; href: string }>) {
    // Store the data
    storeUserSettings({
      birthdays: calendarData,
      activated: true,
    }, true)
      .subscribe(() => {
        sendMessage(updateBadgeAction(), true);
        sendMessage(BirthdaysScanComplete(), true);
      });
  }

  formatEvent(event: PreparedEvent) {
    return {
      name: event.name,
      start: event.start,
      href: event.href,
    };
  }

  generateCalendar(
    events: Array<RestoredBirthday>,
    fromYear: number = 2020, // Use 2020 (leap year)
    tillYear: number = 2020, // Same year
  ) {
    const preparedEvents = generatePreparedEventsForYears(events, fromYear, tillYear);
    return this.generateEvents(preparedEvents);
  }

  generateEvent(event: PreparedEvent) {
    return this.formatEvent(event);
  }
}

