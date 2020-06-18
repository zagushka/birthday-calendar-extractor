import { DateTime } from 'luxon';
import { CalendarCSV } from './csv';
import { CalendarICS } from './ics';
import { CalendarJSON } from './json';
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
  // stamp: string;
  name: string;
  start: DateTime;
  end: DateTime;
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

  return {
    name: event.name,
    start: start, // .toFormat('yyyyLLdd\'T\'HHmmss'),
    end: start.plus({days: 1}), // .toFormat('yyyyLLdd\'T\'HHmmss'),
    // stamp: DateTime.local().toFormat('yyyyLLdd\'T\'HHmmss'),
    href: event.href,
    uid: window.btoa(event.href),
  };
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

export function getLanguagesList() {
  // @ts-ignore
  return languages.flatMap(l => l.languages);
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
    return;
  }

  // find week day number by the name
  const weekDayNumber = weekDayNumberByName(languageSet, result.groups.weekDayName);

  if (-1 === weekDayNumber) {
    return;
  }
  const weekDay = weekDates()[weekDayNumber];
  return {
    name: result.groups.name,
    day: +weekDay.day,
    month: +weekDay.month,
  };
}

function generateRawEvents(cardsElements: NodeListOf<HTMLLinkElement>, languageSet: LanguageSet): Array<RawEvent> {
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

export function parseCalendarAndSave() {
  const languageSet = findLanguageSetByLanguage(detectFacebookLanguage());

  const cardsElements = document.querySelectorAll<HTMLLinkElement>(CARDS_QUERY_SELECTOR_PATTERN);
  const events: Array<RawEvent> = generateRawEvents(cardsElements, languageSet);

  const calendar = new CalendarJSON();
  // const calendar = new CalendarICS();
  // const calendar = new CalendarCSV();
  // calendar.generateAndSave(events);
  return calendar.generateCalendar(events);
}
