import {
  merge,
  of,
  zip,
} from 'rxjs';
import {
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import {
  ACTION,
  ACTIONS_SET,
  STORAGE_KEYS,
} from './constants';
import { updateBadge } from './libs/badge';
import { CalendarBase } from './libs/base';
import {
  ErrorAction,
  StartGenerationAction,
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
  getBirthdaysList,
  parsePageForConfig,
} from './libs/lib';
import {
  storeLastBadgeClicked,
  storeUserSettings,
} from './libs/storage/chrome.storage';

const handleContentResponse = (firstLevelCallback: (data: any) => void) => (message: any) => {
  if (ACTION.ERROR !== message.type) {
    return;
  }
  chrome.runtime.onMessage.removeListener(handleContentResponse(firstLevelCallback));
  firstLevelCallback(message.status);
};

setupAlarms();

// On Badge Click update last time badge clicked
listenTo(ACTION.BADGE_CLICKED)
  .pipe(
    switchMap(() => storeLastBadgeClicked()),
  )
  .subscribe(() => {
    sendMessage(new UpdateBadgeAction());
  });

// Update Badge on update badge event or new date alarm
merge(
  listenTo(ACTION.BADGE_UPDATE, ACTION.ALARM_NEW_DAY),
)
  .pipe(
    startWith(true), // Initial Badge setup
  )
  .subscribe(() => updateBadge());

// Take care of disable badge event
listenTo<StartGenerationAction>(ACTION.BADGE_NOTIFICATIONS_DISABLE)
  .pipe(
    switchMap(message => zip(
      // Move message forward
      of(message),
      // remove from storage
      storeUserSettings({
        [STORAGE_KEYS.BIRTHDAYS]: [],
        [STORAGE_KEYS.BADGE_ACTIVE]: false,
      }),
    )),
    tap(([{callback}]) => callback()),
  )
  .subscribe(() => {
    // Update badge it should be clean
    sendMessage(new UpdateBadgeAction(), true);
  });

listenTo<StartGenerationAction>(ACTION.GENERATION_START)
  .pipe(
    switchMap(({action, callback}) =>
      parsePageForConfig()
        .pipe(
          switchMap(({language, token}) => getBirthdaysList(language, token)),
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
        ),
    ),
  )
  .subscribe(
    () => {
      sendMessage(new ErrorAction('DONE'));
    },
    (error) => new ErrorAction(error),
  );

