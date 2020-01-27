import * as FileSaver from 'file-saver';
import { DateTime } from 'luxon';
import {
  languages,
  LanguageSet,
} from './languages';

export interface RawEvent {
  name: string;
  month: number;
  day: number;
  href: string;
}

export interface BakedEvent {
  uid: string;
  stamp: string;
  name: string;
  start: string;
  end: string;
  href: string;
}

const LANGUAGE_QUERY_SELECTOR_PATTERN = '#pagelet_rhc_footer span[lang]';
const CARDS_QUERY_SELECTOR_PATTERN = '#birthdays_monthly_card li a';


export function bakeEvent(event: RawEvent, year: number): BakedEvent {
  let start = DateTime.local(year, event.month, event.day);

  // Take care of leap year issues (invalid at days)
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
   *
   * 19980118T230000
   * 1998 01 18 T23 00 00
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

export function weekDates(): { [name: number]: DateTime } {
  const days: { [name: number]: DateTime } = {};

  for (let i = 1; i <= 7; i++) {
    const date = DateTime.local().plus({days: i});
    const weekDayNumber = +date.toFormat('c') - 1; // toFormat('c') returns weekday from 1-7 (Monday is 1, Sunday is 7)
    days[weekDayNumber] = date;
  }
  return days;
}

export function generateCalendar(
  events: Array<RawEvent>,
  tillYear: number = DateTime.local().plus({year: 1}).year,
) {
  return `BEGIN:VCALENDAR
PRODID:Birthday Calendar Extractor for Facebook
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

  return result.map(generateEvent).join('\n');
}

function generateEvent(event: BakedEvent) {
  return `BEGIN:VEVENT
DTSTART;VALUE=DATE:${event.start}
DTEND;VALUE=DATE:${event.end}
DTSTAMP:${event.stamp}
UID:${event.uid}
X-GOOGLE-CALENDAR-CONTENT-DISPLAY:chip
DESCRIPTION:This is <a href='${event.href}'>${event.name}</a> birthday!
SEQUENCE:0
STATUS:CONFIRMED
` +
    // There is unicode cake character before event.name, you may not see it in you editor
    `SUMMARY:🎂 ${event.name}
TRANSP:OPAQUE
END:VEVENT`;
}

export function scrollDown(callBack: () => void, delay = 500, wait = 3000) {

  const scrollInterval = setInterval(() => {
    window.scroll(0, 100000);
  }, delay);

  let lastHeight = document.body.clientHeight;
  const heightInterval = setInterval(() => {
    if (lastHeight !== document.body.clientHeight) {
      lastHeight = document.body.clientHeight;
      return;
    }
    clearInterval(heightInterval);
    clearInterval(scrollInterval);
    callBack();
  }, wait);
}

export function detectFacebookLanguage() {
  return document.querySelectorAll(LANGUAGE_QUERY_SELECTOR_PATTERN)[0].innerHTML;
}

export function findLanguageSetByLanguage(language: string): LanguageSet {
  return languages.find((data) => -1 !== data.languages.findIndex(l => l === language));
}

function extractCardWithDate(src: string, patterns: Array<RegExp>): { name: string, day: number, month: number } {
  let result: RegExpMatchArray;

  patterns.find((p) => {
    result = src.match(p);
    return result;
  });

  if (!result) {
    return;
  }

  return {
    name: result.groups.name,
    day: +result.groups.day,
    month: +result.groups.month,
  };
}

function weekDayNumberByName(languageSet: LanguageSet, weekDayName: string) {
  return languageSet.weekdays.findIndex(w => w === weekDayName);
}

function extractCardWithWeek(src: string, pattern: RegExp, languageSet: LanguageSet): { name: string, day: number, month: number } {
  // Parse as weekday for each pattern
  const result = src.match(pattern);

  if (!result) {
    console.log(src, 1);
    return;
  }

  // find week day number by the name
  const weekDayNumber = weekDayNumberByName(languageSet, result.groups.weekDayName);

  if (-1 === weekDayNumber) {
    console.log(src, 2);
    return;
  }
  const weekDay = weekDates()[weekDayNumber];
  return {
    name: result.groups.name,
    day: +weekDay.day,
    month: +weekDay.month,
  };
}

function generateRawEvents(cardsElements: NodeListOf<Element>, languageSet: LanguageSet): Array<RawEvent> {
  const events: Array<RawEvent> = [];
  cardsElements.forEach((item: HTMLLinkElement) => {
    // 'data-tooltip-content' - contains required data
    const data = item.getAttribute('data-tooltip-content');

    const card = extractCardWithDate(data, languageSet.pattern) ||
      extractCardWithWeek(data, languageSet.weekdays_pattern, languageSet);

    if (card && item.href.length) {
      events.push(Object.assign({}, card, {href: item.href}));
    }
  });
  return events;
}

function saveCalendar(calendarData: string) {
  const blob = new Blob([calendarData], {endings: 'transparent', type: 'text/calendar; charset=UTF-8'});
  FileSaver.saveAs(blob, 'birthday-calendar.ics', {autoBom: true});
}

export function parseCalendarAndSave() {
  const languageSet = findLanguageSetByLanguage(detectFacebookLanguage());

  const cardsElements = document.querySelectorAll(CARDS_QUERY_SELECTOR_PATTERN);
  const events: Array<RawEvent> = generateRawEvents(cardsElements, languageSet);

  const generatedCalendar = generateCalendar(events).replace(/\r?\n/g, '\r\n');
  // saveCalendar(generatedCalendar);
}
