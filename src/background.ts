import { map } from 'rxjs/operators';
import {
  ACTION,
  ACTIONS_SET,
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
  targetFormat: ACTIONS_SET;
}

const userConfig: UserConfig = {targetFormat: ACTIONS_SET.SELECT_FILE_FORMAT_ICS};

const handleContentResponse = (firstLevelCallback: (data: any) => void) => (message: any) => {
  if (ACTION.STATUS_REPORT !== message.type) {
    return;
  }
  chrome.runtime.onMessage.removeListener(handleContentResponse(firstLevelCallback));
  firstLevelCallback(message.status);
};

setupBadges(); // Setup badges

chrome.runtime.onMessage.addListener((message, sender, callback) => {
  if (ACTION.USER_CONFIG_SET === message.type) {
    userConfig.targetFormat = message.targetFormat;
    return true;
  }
  if (ACTION.USER_CONFIG === message.type) {
    callback(userConfig);
    return true;
  }

  if (ACTION.START_GENERATION === message.type) {
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
                case ACTIONS_SET.SELECT_FILE_FORMAT_CSV:
                  calendar = new CalendarCSV();
                  break;
                case ACTIONS_SET.SELECT_FILE_FORMAT_JSON:
                  calendar = new CalendarJSON();
                  break;
                case ACTIONS_SET.SELECT_FILE_FORMAT_ICS:
                  calendar = new CalendarICS();
                  break;
                case ACTIONS_SET.SELECT_FILE_FORMAT_DELETE_ICS:
                  calendar = new CalendarDeleteICS();
                  break;
                case ACTIONS_SET.SELECT_BADGE:
                  calendar = new CalendarJSON();
                  // Not file generation required, just for storage
                  return true;
              }
              return calendar.save(
                calendar.generateCalendar(Array.from(events.values())),
              );
            }),
          )
          .subscribe(() => {
            sendMessage(new StatusReportAction('DONE'));
            callback();
          });
      });

    return true;
  }
});
