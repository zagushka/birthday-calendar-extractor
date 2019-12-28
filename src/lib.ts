import { DateTime } from 'luxon';

export interface RawEvent {
  name: string;
  month: number;
  day: number;
  href: string
}

export interface BakedEvent {
  uid: string;
  stamp: string;
  name: string;
  start: string;
  end: string;
  href: string;
}

export function bakeEvent(event: RawEvent, year: number): BakedEvent {
  let start = DateTime.local(year, event.month, event.day);

  //Take care of leap year issues (invalid at days)
  if ('day out of range' === start.invalidExplanation) {
    start = DateTime.local(year, event.month, 28);
  }

  // Wrong date
  if (!start.isValid) {
    return null;
  }
  /**
   * The date with local time form is simply a DATE-TIME value that does not contain the UTC designator nor does it reference a time zone.
   * For example, the following represents January 18, 1998, at 11 PM:

   19980118T230000
   1998 01 18 T23 00 00
   */

  const baked: BakedEvent = {
    name: event.name,
    start: start.toFormat('yyyyLLdd\'T\'HHmmss'),
    end: start.plus({days: 1}).toFormat('yyyyLLdd\'T\'HHmmss'),
    stamp: DateTime.local().toFormat('yyyyLLdd\'T\'HHmmss'),
    href: event.href,
    uid: '',
  };
  baked.uid = window.btoa(event.href) + '-' + baked.start;

  return baked;
}

export function thisWeekDays(date = DateTime): { [weekDay: string]: DateTime } {
  const weeks: { [weekDay: string]: DateTime } = {};
  for (let i = 1; i <= 7; i++) {
    const weekDay = date.local().plus({'days': i});
    weeks[weekDay.weekdayLong] = weekDay.plus({'days': 1});
  }
  return weeks;
}

export const DATE_FORMAT = 'YYYYMMDD';

export function generateCalendar(
  events: Array<RawEvent>,
  tillYear: number = DateTime.local().plus({'year': 2}).year,
) {
  return `BEGIN:VCALENDAR
PRODID:-//Google Inc//Google Calendar 70.9054//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
${generateEvents(events, tillYear)}
END:VCALENDAR`;
}

function generateEvents(events: Array<RawEvent>, tillYear: number) {
  let year = DateTime.local().year;
  const result: Array<BakedEvent> = [];

  do {
    events.forEach(event => {
      const baked = bakeEvent(event, year);
      if (baked) {
        result.push(baked);
      }
    });
    year++;
  } while (tillYear >= year);

  return result.map(generateEvent).join('\n\r');
}

function generateEvent(event: BakedEvent) {
  return `BEGIN:VEVENT
DTSTART;VALUE=DATE:${event.start}
DTEND;VALUE=DATE:${event.end}
DTSTAMP:${event.stamp}
UID:${event.uid}
X-GOOGLE-CALENDAR-CONTENT-DISPLAY:chip
X-GOOGLE-CALENDAR-CONTENT-ICON:https://calendar.google.com/googlecalendar/images/cake.gif
CLASS:PUBLIC
DESCRIPTION:This is <a href='${event.href}'>${event.name}</a> birthday!
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:${event.name}'s birthday
TRANSP:OPAQUE
END:VEVENT`;
}
