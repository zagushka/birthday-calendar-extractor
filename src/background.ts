import { merge } from 'rxjs';
import {
  map,
  startWith,
} from 'rxjs/operators';
import {
  ACTION,
  ACTIONS_SET,
  STORAGE_KEYS,
} from './constants';
import { updateBadge } from './libs/badge';
import { CalendarBase } from './libs/base';
import {
  StartGenerationAction,
  StatusReportAction,
  UpdateBadgeAction,
} from './libs/events/actions';
import { setupAlarms } from './libs/events/alarms';
import {
  listenTo,
  sendMessage,
} from './libs/events/events';
import { CalendarCSV } from './libs/formats/csv';
import { CalendarDeleteICS } from './libs/formats/delete-ics';
import { CalendarForStorage } from './libs/formats/for-storage';
import { CalendarICS } from './libs/formats/ics';
import { CalendarJSON } from './libs/formats/json';
import {
  findLanguageSetByLanguage,
  getBirthdaysList,
  parsePageForConfig,
} from './libs/lib';
import { storeUserSettings } from './libs/storage/chrome.storage';

const handleContentResponse = (firstLevelCallback: (data: any) => void) => (message: any) => {
  if (ACTION.STATUS_REPORT !== message.type) {
    return;
  }
  chrome.runtime.onMessage.removeListener(handleContentResponse(firstLevelCallback));
  firstLevelCallback(message.status);
};

setupAlarms();

// Update Badge on update badge event or new date alarm
merge(
  listenTo(ACTION.UPDATE_BADGE, ACTION.ALARM_NEW_DAY),
)
  .pipe(
    startWith(true), // Initial Badge setup
  )
  .subscribe(() => updateBadge());

listenTo<StartGenerationAction>(ACTION.START_GENERATION)
  .subscribe(({action, callback}) => {
    // Take care of disable badge event
    if (ACTIONS_SET.DISABLE_BADGE === action.format) {
      storeUserSettings({
        [STORAGE_KEYS.BIRTHDAYS]: [],
        [STORAGE_KEYS.BADGE_ACTIVE]: false,
      })
        .subscribe(() => {
          sendMessage(new UpdateBadgeAction(), true);
          callback();
        });
      return true;
    }

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
              switch (action.format) {
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
                case ACTIONS_SET.ENABLE_BADGE:
                  calendar = new CalendarForStorage();
                  break;
                default:
                  return;
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
  });
