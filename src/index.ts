// Icon source : http://free-icon-rainbow.com/birthday-cake-free-icon-2/
import * as FileSaver from 'file-saver';
import { languages } from './languages';
import {
  generateCalendar,
  RawEvent,
  weekDates,
} from './lib';

// tslint:disable-next-line:only-arrow-functions
(function () {
  const destinationElement = document.querySelectorAll('#events_dashboard_find_events ul')[0];
  const button = document.createElement('a');
  button.innerText = 'Save Birthday Calendar';
  button.addEventListener('click', () => scrollDown(parseCalendarAndSave));
  destinationElement.append(button);

  function scrollDown(callBack: () => void, delay = 500, wait = 3000) {

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

  function parseCalendarAndSave() {
    const cardsElements = document.querySelectorAll('#birthdays_monthly_card li a');
    const currentLanguage = document.querySelectorAll('#pagelet_rhc_footer span[lang]')[0].innerHTML;

    const languageSet = languages.find((data) => -1 !== data.languages.findIndex(l => l === currentLanguage));

    console.log(languageSet);

    const nextWeekDays = weekDates();

    console.log(nextWeekDays);
    const regExpForDateWithWeekday = new RegExp('(?<name>.*) \\((?<weekDayName>[^)]*)\\)$');

    const events: Array<RawEvent> = [];

    cardsElements.forEach((item: HTMLLinkElement) => {
      const href = item.href;
      // const data = unescapeUnicode(item.getAttribute('data-tooltip-content')); // 'data-tooltip-content' - text format "NAME (M/D)"
      const data = item.getAttribute('data-tooltip-content'); // 'data-tooltip-content' - text format "NAME (M/D)"
      // tslint:disable-next-line:one-variable-per-declaration
      let name, month, day;

      const result = data.match(languageSet.pattern);
      console.log(data);
      if (result) { // Date was found
        console.log(result.groups);
        name = result.groups.name;
        day = +result.groups.day;
        month = +result.groups.month;
      } else {
        // Try to parse as weekday
        const weekDayName = data.match(regExpForDateWithWeekday);
        if (!weekDayName) {
          return;
        }
        console.log(weekDayName.groups);

        // find week day number by the name
        const weekDayNumber = languageSet.weekdays.findIndex(w => w === weekDayName.groups.weekDayName);

        if (-1 === weekDayNumber) {
          return;
        }

        const weekDay = nextWeekDays[weekDayNumber];
        name = weekDayName.groups.name;
        month = +weekDay.month;
        day = +weekDay.day;
      }

      if (
        undefined !== typeof day &&
        href.length &&
        -1 === events.findIndex((v) => v.href === href) // Remove duplicates
      ) {
        console.log({name, month, day, href});
        events.push({name, month, day, href});
      }
    });

    const generatedCalendar = generateCalendar(events).replace(/\r?\n/g, '\r\n');
    const blob = new Blob([generatedCalendar], {endings: 'transparent', type: 'text/calendar; charset=UTF-8'});
    FileSaver.saveAs(blob, 'birthday-calendar.ics', {autoBom: true});
  }
})();
