import { DateTime } from 'luxon';
import {
  STORAGE_KEYS,

} from '../../constants';
import { UpdateBadgeAction } from '../events/actions';
import { CalendarBase } from '../base';
import { sendMessage } from '../events/events';
import {
  PreparedEvent,
  RawEvent,
} from '../lib';
import { storeUserSettings } from '../storage/chrome.storage';

export class CalendarForStorage extends CalendarBase<{ name: string; start: DateTime; href: string },
  { name: string; start: DateTime; href: string },
  Array<{ name: string; start: DateTime; href: string }>> {
  readonly filename: string;
  readonly fileMimeType: string;

  save(calendarData: Array<{ name: string; start: DateTime; href: string }>) {
    // Store the data
    storeUserSettings({
      [STORAGE_KEYS.BIRTHDAYS]: calendarData,
      [STORAGE_KEYS.BADGE_ACTIVE]: true,
    })
      .subscribe(() => sendMessage(new UpdateBadgeAction()));
  }

  formatEvent(event: PreparedEvent) {
    return {
      name: event.name,
      start: event.start,
      href: event.href,
    };
  }

  generateCalendar(
    events: Array<RawEvent>,
    fromYear: number = 2020, // Use 2020 (leap year)
    tillYear: number = 2020, // Same year
  ) {
    const preparedEvents = this.generatePreparedEventsForYears(events, fromYear, tillYear);
    return this.generateEvents(preparedEvents);
  }

  generateEvent(event: PreparedEvent) {
    return this.formatEvent(event);
  }
}

