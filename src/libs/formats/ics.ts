import { DateTime } from 'luxon';
import { CalendarBase } from '../base';
import {
  generatePreparedEventsForYears,
  PreparedEvent,
} from '../lib';
import { reviveBirthday } from '../storage/chrome.storage';
import {
  IcsSettings,
  StoredBirthday,
} from '../storage/storaged.types';

interface IcsEvent {
  start: string;
  end: string;
  stamp: string;
  uid: string;
  description: string;
  summary: string;
}

function generateIcsEvent(event: IcsEvent) {
  return `BEGIN:VEVENT
DTSTART;VALUE=DATE:${event.start}
DTEND;VALUE=DATE:${event.end}
RRULE:FREQ=YEARLY
DTSTAMP:${event.stamp}
UID:${event.uid}
DESCRIPTION:${event.description}
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:${event.summary}
TRANSP:TRANSPARENT
END:VEVENT`;
}

export class CalendarICS extends CalendarBase<{}, string, string> {
  readonly filename: string = 'birthday-calendar.ics';
  readonly fileMimeType: string = 'text/calendar; charset=UTF-8';

  constructor(public settings: IcsSettings) {
    super();
  }

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
    /**
     * The date with local time form is simply a DATE-TIME value that does not contain the UTC designator nor does it reference a time zone.
     * For example, the following represents January 18, 1998, at 11 PM:
     *
     */
    return {
      name: event.name,
      start: event.start.toFormat('yyyyLLdd'),
      end: event.start.plus({days: 1}).toFormat('yyyyLLdd'),
      stamp: DateTime.utc().toFormat('yyyyLLdd\'T\'HHmmss\'Z\''),
      href: event.href,
      uid: event.uid,
    };
  }

  generateCalendar(
    storedBirthdays: Array<StoredBirthday>,
    fromYear: number = 2020, // Since all the events are recurring I generate them for leap year 2020
    tillYear: number = 2020,
  ) {

    const events = storedBirthdays.map(reviveBirthday);

    const preparedEvents = generatePreparedEventsForYears(events, fromYear, tillYear)
      // Sort incrementally
      .sort((a, b) => a.start.toSeconds() - b.start.toSeconds());

    return `BEGIN:VCALENDAR
PRODID:Birthday Calendar Extractor for Facebook
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
${this.generateEvents(preparedEvents).join('\n')}
END:VCALENDAR`.replace(/\r?\n/g, '\r\n');
  }

  generateEvents(events: Array<PreparedEvent>): Array<string> {
    const grouped =
      events.reduce((ac, event) => {
        if (!ac.has(event.start)) {
          ac.set(event.start, []);
        }
        ac.set(event.start, [...ac.get(event.start), event]);
        return ac;
      }, new Map<DateTime, Array<PreparedEvent>>());

    return events.map(e => this.generateEvent(e)); // Generate final events
  }

  generateEvent(event: PreparedEvent) {
    const formattedEvent = this.formatEvent(event);
    return generateIcsEvent({
      start: formattedEvent.start,
      end: formattedEvent.end,
      stamp: formattedEvent.stamp,
      uid: formattedEvent.uid,
      // There is unicode cake character before event.name, you may not see it in you editor
      summary: `🎂 ${formattedEvent.name}`,
      description: `This is <a href='${formattedEvent.href}'>${formattedEvent.name}</a> birthday!`,
    });
  }
}
