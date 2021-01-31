import {
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { updateBadge } from './libs/badge';
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
  getBirthdaysList,
} from './libs/lib';
import {
  storeLastBadgeClicked,
  storeUserSettings,
} from './libs/storage/chrome.storage';

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
listenTo(UPDATE_BADGE, ALARM_NEW_DAY)
  .pipe(
    startWith(true), // Initial Badge setup
  )
  .subscribe(() => updateBadge());

// Take care of disable badge event
listenTo(DISABLE_BADGE_NOTIFICATION)
  .pipe(
    switchMap(({action, callback}) => {
      // remove from storage
      return storeUserSettings({
        birthdays: [],
        badgeActive: false,
      });
    }),
  )
  .subscribe(() => {
    // Update badge it should be clean
    sendMessage(updateBadgeAction(), true);
  });

// Tell to tha app new data was fetched and request to update the badge
// Should be done via local storage update
// sendMessage(updateBadgeAction(), true);

listenTo(BIRTHDAYS_START_SCAN)
  .pipe(
    // Update local storage, set isScanning true
    switchMap(() => storeUserSettings({isScanning: true})),
    // Start Scan
    forceBirthdaysScan,
  )
  .subscribe((birthdays) => {
    // Update local storage, set isScanning false
    storeUserSettings({isScanning: false});
  });

listenTo(
  CREATE_CALENDAR_CSV,
  CREATE_CALENDAR_ICS,
  CREATE_CALENDAR_DELETE_ICS,
  CREATE_CALENDAR_JSON,
)
  .pipe(
    switchMap(({action, callback}) =>
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
              default:
                throw new Error('Should not be here');
            }
          }),
          tap(() => callback()),
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

