import * as moment from 'moment';

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
  // month - 1, because of https://momentjs.com/docs/#/parsing/array/
  const start = moment([year, event.month - 1, event.day]);

  //Take care of leap year issues (invalid at days)
  if (2 === start.invalidAt()) {
    start.set('day', 28);
  }

  // Wrong date
  if (!start.isValid()) {
    return null;
  }

  const baked: BakedEvent = {
    name: event.name,
    start: start.format(DATE_FORMAT),
    end: start.clone().add(1, 'day').format(DATE_FORMAT),
    stamp: moment().format('YYYYMMDDTHHmmss'),
    href: event.href,
    uid: '',
  };
  baked.uid = window.btoa(event.href) + '-' + baked.start;

  return baked;
};

export const DATE_FORMAT = 'YYYYMMDD';

export function generateCalendar(events: Array<RawEvent>, tillYear: number) {
  return `BEGIN:VCALENDAR
PRODID:-//Google Inc//Google Calendar 70.9054//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
${generateEvents(events, tillYear)}
END:VCALENDAR
`;
}

function generateEvents(events: Array<RawEvent>, tillYear: number) {
  const now = moment();
  let year = now.get('year');
  let result = '';

  do {
    result += events.reduce((c, event) => {
      const baked = bakeEvent(event, year);
      c += baked && generateEvent(baked);
      return c;
    }, '');
    year++;
  } while (tillYear >= year);

  return result;
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
END:VEVENT
`;
}
