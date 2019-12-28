// Icon source : http://free-icon-rainbow.com/birthday-cake-free-icon-2/
import * as FileSaver from 'file-saver';
import {
  generateCalendar,
  RawEvent,
  thisWeekDays,
} from './lib';

(function() {
  const destinationElement = document.querySelectorAll('#events_dashboard_find_events ul')[0];
  const button = document.createElement('a');
  button.innerText = 'Save Birthday Calendar';
  button.addEventListener('click', () => scrollDown(parseCalendarAndSave));
  destinationElement.append(button);

  function scrollDown(callBack: Function, delay = 500, wait = 3000) {

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
    const result = document.querySelectorAll('#birthdays_monthly_card li a');

    const nextWeekDays = thisWeekDays();
    const regExpForDateWithDays = new RegExp('(.*) \\(([0-9]{1,2})\\/([0-9]{1,2})\\)$');
    const regExpForDateWithWeekday = new RegExp('(.*) \\(([\\w]*)\\)$');

    const events: Array<RawEvent> = [];

    result.forEach((item: HTMLLinkElement) => {
      const href = item.href;
      const data = item.getAttribute('data-tooltip-content'); // 'data-tooltip-content' - text format "NAME (M/D)"
      let name, month, day;

      const result = data.match(regExpForDateWithDays);

      if (result) { // Date is found
        [, name, month, day] = result;
      } else {
        // Try to parse as weekday
        const result = data.match(regExpForDateWithWeekday);
        if (!result || !nextWeekDays[result[2]]) {
          return;
        }

        const weekDay = nextWeekDays[result[2]];
        name = result[1];
        month = weekDay.month;
        day = weekDay.day;
      }

      if (
        undefined !== typeof day &&
        href.length &&
        -1 === events.findIndex((v) => v.href === href) // Remove duplicates
      ) {
        events.push({name, month: +month, day: +day, href});
      }
    });

    const generatedCalendar = generateCalendar(events);

    const blob = new Blob([generatedCalendar], {type: 'text/plain;charset=utf-8'});
    FileSaver.saveAs(blob, 'birthday-calendar.ics');
  }
})();
