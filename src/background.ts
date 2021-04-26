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
  BirthdaysStartExtractionAction,
  SHOW_MODAL_SCAN_SUCCESS,
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

listenTo<BirthdaysStartExtractionAction>(BIRTHDAYS_START_SCAN)
  .subscribe(({action}) => {
    sendScanLog('SCAN_LOG_PROCESS_STARTED');
    // Update local storage, set scanning true
    storeUserSettings({scanning: DateTime.utc().plus({minutes: 2}).toMillis()}, true)
      .pipe(
        // Start scan
        switchMap(() => forceBirthdaysScan(false)),
        switchMap(() => forceBirthdaysScan(true)),
      )
      .subscribe({
        next: () => {
          sendScanLog('SCAN_LOG_PROCESS_DONE');
          sendMessage(updateBadgeAction(), true);
          storeUserSettings({scanning: 0, scanSuccess: true, modal: {type: SHOW_MODAL_SCAN_SUCCESS}});
        },
        error: (error: ScanErrorPayload) => {
          storeUserSettings({scanning: 0, scanSuccess: false, modal: error});
        },
      });
  });

chrome.runtime.onInstalled.addListener((details) => {
  if ('update' === details.reason) {
    // const thisVersion = chrome.runtime.getManifest().version;
    // Open a new page with changes for everyone upgrading from version 2 to 3
    if ('2' === details.previousVersion.charAt(0)) {
      // console.log('Updated from ' + details.previousVersion + ' to ' + thisVersion + '!');
      chrome.tabs.create({url: 'static/update-from-2.html'});
    }
  }
});

storeUserSettings({scanning: 0}); // Unlock scanning
setupAlarms(); // Setup alarms
