import * as FileSaver from 'file-saver';
import {
  generateCalendar,
  RawEvent,
} from './lib';

const result = document.querySelectorAll('#birthdays_monthly_card li a');

const path = new RegExp('(.*) \\(([0-9]{1,2})\\/([0-9]{1,2})\\)$');

const events: Array<RawEvent> = [];

result.forEach((item: HTMLLinkElement) => {
  const href = item.href;
  const data = item.getAttribute('data-tooltip-content'); // 'data-tooltip-content' - text format "NAME (M/D)"
  const [, name, month, day] = data.match(path);
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

