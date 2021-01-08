import { merge } from 'rxjs';
import {
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { updateBadge } from './libs/badge';
import { CalendarBase } from './libs/base';
import {
  sendError,
  updateBadgeAction,
} from './libs/events/actions';
import { setupAlarms } from './libs/events/alarms';
import {
  listenTo,
  sendMessage,
} from './libs/events/events';
import {
  ALARM_NEW_DAY,
  BADGE_CLICKED,
  CREATE_CALENDAR_CSV,
  CREATE_CALENDAR_DELETE_ICS,
  CREATE_CALENDAR_ICS,
  CREATE_CALENDAR_JSON,
  ENABLE_BADGE_NOTIFICATION,
  SEND_ERROR,
  UPDATE_BADGE,
} from './libs/events/types';
import { CalendarCSV } from './libs/formats/csv';
import { CalendarDeleteICS } from './libs/formats/delete-ics';
import { CalendarForStorage } from './libs/formats/for-storage';
import { CalendarICS } from './libs/formats/ics';
import { CalendarJSON } from './libs/formats/json';
import {
  getBirthdaysList,
  parsePageForConfig,
} from './libs/lib';
import { storeLastBadgeClicked } from './libs/storage/chrome.storage';

const handleContentResponse = (firstLevelCallback: (data: any) => void) => (message: any) => {
  if (SEND_ERROR !== message.type) {
    return;
  }
  chrome.runtime.onMessage.removeListener(handleContentResponse(firstLevelCallback));
  firstLevelCallback(message.status);
};

setupAlarms();

// On Badge Click update last time badge clicked
listenTo(BADGE_CLICKED)
  .pipe(
    switchMap(() => storeLastBadgeClicked()),
  )
  .subscribe(() => {
    sendMessage(updateBadgeAction());
  });

// Update Badge on update badge event or new date alarm
merge(
  listenTo(UPDATE_BADGE, ALARM_NEW_DAY),
)
  .pipe(
    startWith(true), // Initial Badge setup
  )
  .subscribe(() => updateBadge());

// Take care of disable badge event
// listenTo<StartGenerationAction>(ACTION.BADGE_NOTIFICATIONS_DISABLE)
//   .pipe(
//     switchMap(message => zip(
//       // Move message forward
//       of(message),
//       // remove from storage
//       storeUserSettings({
//         [STORAGE_KEYS.BIRTHDAYS]: [],
//         [STORAGE_KEYS.BADGE_ACTIVE]: false,
//       }),
//     )),
//     tap(([{callback}]) => callback()),
//   )
//   .subscribe(() => {
//     // Update badge it should be clean
//     sendMessage(new UpdateBadgeAction(), true);
//   });

listenTo(
  CREATE_CALENDAR_CSV,
  CREATE_CALENDAR_ICS,
  CREATE_CALENDAR_DELETE_ICS,
  CREATE_CALENDAR_JSON,
  ENABLE_BADGE_NOTIFICATION,
)
  .pipe(
    switchMap(({action, callback}) =>
      parsePageForConfig()
        .pipe(
          switchMap(({language, token}) => getBirthdaysList(language, token)),
          map(events => {
            let calendar: CalendarBase<any, any, any>;
            switch (action.type) {
              case CREATE_CALENDAR_CSV:
                action.payload.dateFormat;
                calendar = new CalendarCSV();
                break;
              case CREATE_CALENDAR_JSON:
                calendar = new CalendarJSON();
                break;
              case CREATE_CALENDAR_ICS:
                calendar = new CalendarICS();
                break;
              case CREATE_CALENDAR_DELETE_ICS:
                calendar = new CalendarDeleteICS();
                break;
              case ENABLE_BADGE_NOTIFICATION:
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
      // @TODO REFACTOR
      sendMessage(sendError('DONE'));
    },
    (error) => sendMessage(sendError(error)),
  );

