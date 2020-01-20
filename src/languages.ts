export const languages = [
  {
    languages: ['English (UK)'],
    pattern: new RegExp('(?<name>.*) \\((?<day>[0-9]{1,2})[^0-9](?<month>[0-9]{1,2})\\)$'),
    weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  {
    languages: ['English (US)'],
    pattern: new RegExp('(?<name>.*) \\((?<month>[0-9]{1,2})[^0-9](?<day>[0-9]{1,2})\\)$'),
    weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  {
    languages: ['Русский'],
    pattern: new RegExp('(?<name>.*) \\((?<day>[0-9]{1,2})[^0-9](?<month>[0-9]{1,2})\\)$'),
    weekdays: ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'],
  },
  {
    languages: ['Українська'],
    pattern: new RegExp('(?<name>.*) \\((?<day>[0-9]{1,2})[^0-9](?<month>[0-9]{1,2})\\)$'),
    weekdays: ['понеділок', 'вівторок', 'середа', 'четвер', 'п\'ятниця', 'субота', 'неділя'],
  },
  {
    languages: ['עברית'],
    pattern: new RegExp('(?<name>.*) \\((?<day>[0-9]{1,2})[^0-9](?<month>[0-9]{1,2})\\)$'),
    weekdays: ['יום שני', 'יום שלישי', 'רביעי', 'יום חמישי', 'שישי', 'שבת', 'ראשון'],
  },
];
