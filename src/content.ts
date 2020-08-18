// Icon source : http://free-icon-rainbow.com/birthday-cake-free-icon-2/
import { CalendarBase } from './libs/base';
import { CalendarDeleteICS } from './libs/delete-ics';
import { CalendarICS } from './libs/ics';
import {
  findLanguageSetByLanguage,
  getBirthdaysList,
  parsePageForConfig,
} from './libs/lib';

parsePageForConfig()
  .subscribe(({language, token}) => {
    if (!token) {
      chrome.runtime.sendMessage({
        action: 'CONTENT_STATUS_REPORT',
        message: 'NO_TOKEN_DETECTED',
      });
      return;
    }

    if (!findLanguageSetByLanguage(language)) {
      chrome.runtime.sendMessage({
        action: 'CONTENT_STATUS_REPORT',
        message: 'NOT_SUPPORTED_LANGUAGE',
      });
      return;
    }

    chrome.runtime.sendMessage({
      action: 'CONTENT_STATUS_REPORT',
      message: 'WORKING',
    });

    getBirthdaysList(language, token)
      .subscribe(events => {
        let calendar: CalendarBase<any, any, any>;
        switch ('ics') {
          case 'ics':
            calendar = new CalendarICS();
            return calendar.save(calendar.generateCalendar(Array.from(events.values())));
          case 'delete-ics':
            calendar = new CalendarDeleteICS();
            return calendar.save(calendar.generateCalendar(Array.from(events.values())));
        }
      });
  });



