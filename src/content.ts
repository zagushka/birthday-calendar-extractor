// Icon source : http://free-icon-rainbow.com/birthday-cake-free-icon-2/
import { CalendarICS } from './libs/ics';
import {
  findLanguageSetByLanguage,
  getBirthdaysList,
  parsePageForConfig,
} from './libs/lib';

parsePageForConfig()
  .then(({language, token}) => {
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
      .then(events => {
        const calendar = new CalendarICS();
        return calendar.save(calendar.generateCalendar(Array.from(events.values())));
      });
  });



