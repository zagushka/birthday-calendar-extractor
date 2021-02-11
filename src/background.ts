import {
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { fetchUserFriendsBirthdayInfoFromContext } from './context';
import { updateBadge } from './libs/badge';
import {
  sendError,
  SendScanLog,
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
  BIRTHDAYS_START_SCAN,
  CREATE_CALENDAR_CSV,
  CREATE_CALENDAR_DELETE_ICS,
  CREATE_CALENDAR_ICS,
  CREATE_CALENDAR_JSON,
  DISABLE_BADGE_NOTIFICATION,
  UPDATE_BADGE,
} from './libs/events/types';
import { CalendarCSV } from './libs/formats/csv';
import { CalendarDeleteICS } from './libs/formats/delete-ics';
import { CalendarICS } from './libs/formats/ics';
import { CalendarJSON } from './libs/formats/json';
import {
  forceBirthdaysScan,
  forceBirthdaysScanNew,
  forceUserBirthdaysScanFromContext,
  getBirthdaysList,
  sendScanLog,
} from './libs/lib';
import {
  storeLastBadgeClicked,
  storeUserSettings,
} from './libs/storage/chrome.storage';

// On Badge Click update last time badge clicked
listenTo(BADGE_CLICKED)
  .subscribe(() => {
    storeLastBadgeClicked()
      .subscribe(() => {
        sendMessage(updateBadgeAction(), true);
      });
  });

// Update Badge on badge update request or new date alarm
listenTo(UPDATE_BADGE, ALARM_NEW_DAY)
  .pipe(
    startWith(true), // Initial Badge setup
  )
  .subscribe(() => updateBadge());

// Take care of disable badge event
listenTo(DISABLE_BADGE_NOTIFICATION)
  .subscribe(() => {
    storeUserSettings({
      birthdays: [],
      activated: false,
    })
      .subscribe(() => {
        // Update badge it should be clean
        sendMessage(updateBadgeAction(), true);
      });
  });

// Tell to tha app new data was fetched and request to update the badge
// Should be done via local storage update
// sendMessage(updateBadgeAction(), true);

listenTo(BIRTHDAYS_START_SCAN)
  .subscribe(() => {
    sendScanLog('SCAN_LOG_PROCESS_STARTED');
    // Update local storage, set scanning true
    storeUserSettings({scanning: true})
      .pipe(
        // Force scan
        switchMap(() => forceBirthdaysScanNew()),
      )
      .subscribe(
        birthdays => {
          sendScanLog('SCAN_LOG_PROCESS_DONE');
          storeUserSettings({scanning: false, scanSuccess: true}, true);
        },
        error => {
          sendMessage(SendScanLog(error), true);
          storeUserSettings({scanning: false, scanSuccess: false}, true);
        },
      );
  });

listenTo(
  CREATE_CALENDAR_CSV,
  CREATE_CALENDAR_ICS,
  CREATE_CALENDAR_DELETE_ICS,
  CREATE_CALENDAR_JSON,
)
  .subscribe(({action, callback}) => {
    // Start
    getBirthdaysList()
      .pipe(
        map(events => {
          const rawEvents = Array.from(events.values());
          switch (action.type) {
            case CREATE_CALENDAR_CSV: {
              const calendar = new CalendarCSV(action.payload);
              return calendar.save(calendar.generateCalendar(rawEvents));
            }
            case CREATE_CALENDAR_JSON: {
              const calendar = new CalendarJSON();
              return calendar.save(calendar.generateCalendar(rawEvents));
            }
            case CREATE_CALENDAR_ICS: {
              const calendar = new CalendarICS(action.payload);
              return calendar.save(calendar.generateCalendar(rawEvents));
            }
            case CREATE_CALENDAR_DELETE_ICS: {
              const calendar = new CalendarDeleteICS(action.payload);
              return calendar.save(calendar.generateCalendar(rawEvents));
            }
          }
        }),
      )
      .subscribe(
        // @TODO REFACTOR
        () => sendMessage(sendError('DONE')),
        (error) => {
          sendMessage(sendError(error));
          callback();
        },
        () => callback(),
      );
  });

chrome.runtime.onStartup.addListener(() => {
  storeUserSettings({scanning: false}, true);
  setupAlarms();
});
