// Icon source : http://free-icon-rainbow.com/birthday-cake-free-icon-2/
import { bindCallback } from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';
import { UserConfig } from './background';
import {
  GetUserConfigAction,
  StatusReportAction,
} from './constants';
import { CalendarBase } from './libs/base';
import { CalendarCSV } from './libs/csv';
import { CalendarDeleteICS } from './libs/delete-ics';
import { CalendarICS } from './libs/ics';
import {
  findLanguageSetByLanguage,
  getBirthdaysList,
  parsePageForConfig,
  sendMessage,
} from './libs/lib';

parsePageForConfig()
  .subscribe(({language, token}) => {
    if (!token) {
      sendMessage(new StatusReportAction('NO_TOKEN_DETECTED'));
      return;
    }

    if (!findLanguageSetByLanguage(language)) {
      sendMessage(new StatusReportAction('NOT_SUPPORTED_LANGUAGE'));
      return;
    }

    const sendMessageAsObservable = bindCallback<any, UserConfig>(chrome.runtime.sendMessage);

    sendMessageAsObservable(new GetUserConfigAction())
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
              return calendar.save(
                calendar.generateCalendar(Array.from(events.values()))
              );
            }),
          ),
        ),
      )
      .subscribe(() => {
        sendMessage(new StatusReportAction('DONE'));
      });
  });



