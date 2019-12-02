import * as FileSaver from 'file-saver';
import {
  generateCalendar,
  RawEvent,
  thisWeekDays,
} from './lib';

(function() {
  const destinationElement = document.querySelectorAll('#events_dashboard_find_events ul')[0];
  const button = document.createElement('a');
  button.innerText = 'CLICK ME';
  button.addEventListener('click', justDoIy);
  destinationElement.append(button);

  function justDoIy() {
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

    const generatedCalendar = generateCalendar(events, 2019);

    const blob = new Blob([generatedCalendar], {type: 'text/plain;charset=utf-8'});
    FileSaver.saveAs(blob, 'birthday calendar.ics');
  }
})();
