import { DateTime } from 'luxon';
import {
  startWith,
  switchMap,
} from 'rxjs/operators';
import { updateBadge } from './libs/badge';
import {
  forceBirthdaysScan,
  sendScanLog,
} from './libs/birthdays-scan';
import { updateBadgeAction } from './libs/events/actions';
import { setupAlarms } from './libs/events/alarms';
import {
  listenTo,
  sendMessage,
} from './libs/events/events';
import { ScanErrorPayload } from './libs/events/executed-script.types';
import {
  ALARM_NEW_DAY,
  BADGE_CLICKED,
  BIRTHDAYS_START_SCAN,
  UPDATE_BADGE,
} from './libs/events/types';
import { storeUserSettings } from './libs/storage/chrome.storage';

// On Badge Click update last time badge clicked
listenTo(BADGE_CLICKED)
  .subscribe(() => {
    /**
     * Since this event only fired when clicked on the badge, we I need to remove dialog message left
     * and mark badge as visited/clicked
     */
    storeUserSettings({modal: null, badgeVisited: DateTime.local()}, true)
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

// Tell to tha app new data was fetched and request to update the badge
// Should be done via local storage update
// sendMessage(updateBadgeAction(), true);

listenTo(BIRTHDAYS_START_SCAN)
  .subscribe(() => {
    sendScanLog('SCAN_LOG_PROCESS_STARTED');
    // Update local storage, set scanning true
    storeUserSettings({scanning: true}, true)
      .pipe(
        // Start scan
        switchMap(forceBirthdaysScan),
      )
      .subscribe({
        next: () => {
          sendScanLog('SCAN_LOG_PROCESS_DONE');
          sendMessage(updateBadgeAction(), true);
          storeUserSettings({scanning: false, scanSuccess: true});
        },
        error: (error: ScanErrorPayload) => {
          storeUserSettings({scanning: false, scanSuccess: false, modal: error});
        },
      });
  });

chrome.runtime.onStartup.addListener(() => {
  storeUserSettings({scanning: false});
  setupAlarms();
});
