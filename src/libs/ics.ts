import * as FileSaver from 'file-saver';
import { DateTime } from 'luxon';
import { CalendarBase } from './base';
import {
  BakedEvent,
  RawEvent,
} from './lib';


export class CalendarICS extends CalendarBase<{}, string, string> {
  readonly filename: string = 'birthday-calendar.ics';
  readonly fileMimeType: string = 'text/calendar; charset=UTF-8';

  save(calendarData: string) {
    const blob = new Blob([calendarData], {endings: 'transparent', type: this.fileMimeType});
    FileSaver.saveAs(blob, this.filename, {autoBom: true});
  }

  formatEvent(event: BakedEvent) {
    /**
     * The date with local time form is simply a DATE-TIME value that does not contain the UTC designator nor does it reference a time zone.
     * For example, the following represents January 18, 1998, at 11 PM:
     *
     * 19980118T230000
     * 1998 01 18 T23 00 00
     */
    return {
      name: event.name,
      start: event.start.toFormat('yyyyLLdd\'T\'HHmmss'),
      end: event.start.plus({days: 1}).toFormat('yyyyLLdd\'T\'HHmmss'),
      stamp: DateTime.utc().toFormat('yyyyLLdd\'T\'HHmmss'),
      href: event.href,
      uid: event.uid,
    };
  }

  generateCalendar(
    events: Array<RawEvent>,
    fromYear: number = 2020, // Since all the events are recurring I generate them for leap year 2020
    tillYear: number = 2020,
  ) {
    return `BEGIN:VCALENDAR
PRODID:Birthday Calendar Extractor for Facebook
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
${this.generateEvents(events, fromYear, tillYear).join('\n')}
END:VCALENDAR`.replace(/\r?\n/g, '\r\n');
  }

  generateEvent(event: BakedEvent) {
    const formattedEvent = this.formatEvent(event);
    return `BEGIN:VEVENT
DTSTART;VALUE=DATE:${formattedEvent.start}
DTEND;VALUE=DATE:${formattedEvent.end}
RRULE:FREQ=YEARLY
DTSTAMP:${formattedEvent.stamp}
UID:${formattedEvent.uid}
X-GOOGLE-CALENDAR-CONTENT-DISPLAY:chip
DESCRIPTION:This is <a href='${formattedEvent.href}'>${formattedEvent.name}</a> birthday!
SEQUENCE:0
STATUS:CONFIRMED
` +
      // There is unicode cake character before event.name, you may not see it in you editor
      `SUMMARY:🎂 ${formattedEvent.name}
TRANSP:TRANSPARENT
END:VEVENT`;
  }
}

