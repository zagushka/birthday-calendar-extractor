// Icon source : http://free-icon-rainbow.com/birthday-cake-free-icon-2/
import { bindCallback } from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';
import { CalendarBase } from './libs/base';
import { CalendarCSV } from './libs/csv';
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

    const sendMessageAsObservable = bindCallback<any, { targetFormat: string }>(chrome.runtime.sendMessage);

    sendMessageAsObservable({
      action: 'USER_CONFIG',
    })
      .pipe(
        switchMap(config => getBirthdaysList(language, token)
          .pipe(
            map(events => {
              let calendar: CalendarBase<any, any, any>;
              switch (config.targetFormat) {
                case 'csv':
                  calendar = new CalendarCSV();
                  break;
                case 'ics':
                  calendar = new CalendarICS();
                  break;
                case 'delete-ics':
                  calendar = new CalendarDeleteICS();
                  break;
              }
              return calendar.save(calendar.generateCalendar(Array.from(events.values())));
            }),
          ),
        ),
      )
      .subscribe(() => {});
  });



