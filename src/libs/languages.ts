const WEEKDAY_REGEXP = new RegExp('(?<name>.*) \\((?<weekDayName>[^)]*)\\)$');

export interface LanguageSet {
  languages: Array<string>;
  pattern: Array<RegExp>;
  weekdays_pattern: RegExp;
  weekdays: Array<string>;
}

export const languages: Array<LanguageSet> = [
  {
    languages: ['English (UK)'],
    pattern: [new RegExp('(?<name>.*) \\((?<day>[0-9]{1,2})[^0-9](?<month>[0-9]{1,2})\\)$')],
    weekdays_pattern: WEEKDAY_REGEXP,
    weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  {
    languages: ['English (US)'],
    pattern: [new RegExp('(?<name>.*) \\((?<month>[0-9]{1,2})[^0-9](?<day>[0-9]{1,2})\\)$')],
    weekdays_pattern: WEEKDAY_REGEXP,
    weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  {
    languages: ['Русский'],
    pattern: [new RegExp('(?<name>.*) \\((?<day>[0-9]{1,2})[^0-9](?<month>[0-9]{1,2})\\)$')],
    weekdays_pattern: WEEKDAY_REGEXP,
    weekdays: ['понедельник', 'вторник', 'cреда', 'четверг', 'пятница', 'суббота', 'воскресенье'],
  },
  {
    languages: ['Українська'],
    pattern: [new RegExp('(?<name>.*) \\((?<day>[0-9]{1,2})[^0-9](?<month>[0-9]{1,2})\\)$')],
    weekdays_pattern: WEEKDAY_REGEXP,
    weekdays: ['понеділок', 'вівторок', 'середа', 'четвер', 'п\'ятниця', 'субота', 'неділя'],
  },
  {
    languages: ['עברית'],
    pattern: [
      new RegExp('\\u{200f}\\u{200e}(?<name>.*)\\u{200e}\\u{200f} \\(\\u{200f}(?<day>[0-9]{1,2})[^0-9](?<month>[0-9]{1,2})\\u{200f}\\)$', 'u'),
      new RegExp('\\u{200f}(?<name>.*)\\u{200f} \\(\\u{200f}(?<day>[0-9]{1,2})[^0-9](?<month>[0-9]{1,2})\\u{200f}\\)$', 'u'),
    ],
    weekdays_pattern: new RegExp('\\u{200f}\\u{200e}(?<name>.*)\\u{200e}\\u{200f} \\((?<weekDayName>[^)]*)\\)$', 'u'),
    weekdays: ['יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'שישי', 'שבת', 'ראשון'],
  },
];
