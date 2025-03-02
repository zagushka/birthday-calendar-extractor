import { DateTime } from "luxon";
import { startWith } from "rxjs/operators";
import { updateBadge } from "@/libs/badge";
import { forceBirthdaysScan, sendScanLog } from "@/libs/birthdays-scan";
import { updateBadgeAction } from "@/libs/events/actions";
import { setupAlarms } from "@/libs/events/alarms";
import { listenTo, sendMessage } from "@/libs/events/events";
import { ScanErrorPayload } from "@/libs/events/executed-script.types";
import {
  ALARM_NEW_DAY,
  BIRTHDAYS_START_SCAN,
  BirthdaysStartExtractionAction,
  SHOW_MODAL_DOWNLOAD_KEYWORD,
  SHOW_MODAL_EXPORT_SUCCESS,
  SHOW_MODAL_SCAN_SUCCESS,
  UPDATE_BADGE,
} from "@/libs/events/types";
import { retrieveUserSettings, storeUserSettings } from "@/libs/storage/chrome.storage";
import { migrations } from "@/migrations/migraions";

// new connection means popup was initiated
chrome.runtime.onConnect.addListener((externalPort) => {
  externalPort.onDisconnect.addListener(async () => {
    // Clean up
    // Remove opened modal
    const { modal } = await retrieveUserSettings(["modal"]);
    if (![SHOW_MODAL_EXPORT_SUCCESS, SHOW_MODAL_SCAN_SUCCESS, SHOW_MODAL_DOWNLOAD_KEYWORD].includes(modal?.type)) {
      await storeUserSettings({ modal: null });
    }
  });

  /**
   * Since this event only fired when clicked on the badge mark badge as visited/clicked
   */
  badeClicked();
});

async function badeClicked() {
  const { badgeVisited } = await retrieveUserSettings(["badgeVisited"]);
  const isTheSameDay = badgeVisited.hasSame(DateTime.local(), "day");

  // if badge was not visited is not today update birthdaysPassed
  if (!isTheSameDay) {
    await storeUserSettings({ badgeVisited: DateTime.local() });
  }
  await updateBadge(!isTheSameDay);
}

// Update Badge on badge update request or new date alarm
listenTo(UPDATE_BADGE, ALARM_NEW_DAY)
  .pipe(
    startWith(true), // Initial Badge setup
  )
  .subscribe(() => updateBadge());

// Tell to tha app new data was fetched and request to update the badge
// Should be done via local storage update
// sendMessage(updateBadgeAction());

listenTo<BirthdaysStartExtractionAction>(BIRTHDAYS_START_SCAN).subscribe(async () => {
  sendScanLog("SCAN_LOG_PROCESS_STARTED");
  // Update local storage, set scanning true
  await storeUserSettings({ scanning: DateTime.utc().plus({ minutes: 2 }).toMillis() });
  try {
    await forceBirthdaysScan();
    sendScanLog("SCAN_LOG_PROCESS_DONE");
    sendMessage(updateBadgeAction());
    await storeUserSettings({ scanning: 0, scanSuccess: true, modal: { type: SHOW_MODAL_SCAN_SUCCESS } });
  } catch (error: unknown) {
    await storeUserSettings({ scanning: 0, scanSuccess: false, modal: error as ScanErrorPayload });
  }
});

chrome.runtime.onInstalled.addListener(migrations);

storeUserSettings({ scanning: 0 }); // Unlock scanning
setupAlarms(); // Setup alarms
