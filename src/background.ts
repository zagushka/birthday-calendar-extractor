import { map } from 'rxjs/operators';
import {
  ACTION,
  StatusReportAction,
} from './constants';
import { setupBadges } from './libs/badge';
import { CalendarBase } from './libs/base';
import { CalendarCSV } from './libs/csv';
import { CalendarDeleteICS } from './libs/delete-ics';
import { CalendarICS } from './libs/ics';
import { CalendarJSON } from './libs/json';
import {
  findLanguageSetByLanguage,
  getBirthdaysList,
  parsePageForConfig,
  sendMessage,
} from './libs/lib';

export interface UserConfig {
  targetFormat: 'ics' | 'csv' | 'delete-ics' | 'json';
}

const userConfig: UserConfig = {targetFormat: 'ics'};

const handleContentResponse = (firstLevelCallback: (data: any) => void) => (message: any) => {
  if (ACTION.STATUS_REPORT !== message.type) {
    return;
  }
  chrome.runtime.onMessage.removeListener(handleContentResponse(firstLevelCallback));
  firstLevelCallback(message.status);
};

setupBadges(); // Setup badges

chrome.runtime.onMessage.addListener((message, sender, callback) => {
  // if (ACTION.LOG === message.type) {
  //   console.log(message.data);
  //   return;
  // }

  if (ACTION.USER_CONFIG_SET === message.type) {
    userConfig.targetFormat = message.targetFormat;
    return true;
  }
  if (ACTION.USER_CONFIG === message.type) {
    callback(userConfig);
    return true;
  }

  if (ACTION.START_GENERATION === message.type) {
    // Correct URL, wait for content response
    // chrome.runtime.onMessage.addListener(
    //   handleContentResponse((data: any) => callback(data)),
    // );
    // Execute content script and CSS`
    // chrome.tabs.insertCSS({file: './content.css'}, () => {
    // chrome.tabs.executeScript({file: './content.js'});
    // });

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

        getBirthdaysList(language, token)
          .pipe(
            map(events => {
              let calendar: CalendarBase<any, any, any>;
              switch (userConfig.targetFormat) {
                case 'csv':
                  calendar = new CalendarCSV();
                  break;
                case 'json':
                  calendar = new CalendarJSON();
                  break;
                case 'ics':
                  calendar = new CalendarICS();
                  break;
                case 'delete-ics':
                  calendar = new CalendarDeleteICS();
                  break;
              }
              return calendar.save(
                calendar.generateCalendar(Array.from(events.values())),
              );
            }),
          )
          .subscribe(() => {
            sendMessage(new StatusReportAction('DONE'));
          });
      });

    return true;
  }
});
