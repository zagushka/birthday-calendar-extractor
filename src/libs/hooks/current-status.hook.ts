import type { Location } from "react-router-dom";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { concat, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ShowModalAction } from "@/libs/events/types";
import { listenToUserSettings, retrieveUserSettings, storeUserSettings } from "@/libs/storage/chrome.storage";
import { Settings, StoredBirthday, WizardsSettings } from "@/libs/storage/storaged.types";

/**
 * Return always updated stored values
 */
export function useCurrentStatus() {
  const [initDone, setInitDone] = useState<boolean>(false);
  const [location, setLocation] = useState<Location>();
  const [wizardsSettings, setWizardsSettings] = useState<WizardsSettings>();
  const [isActive, setIsActive] = useState<boolean>(); // is Active
  const [modal, setModal] = useState<ShowModalAction>(); // is Error
  const [isScanning, setIsScanning] = useState<boolean>(); // is Scanning in process
  const [isScanSucceed, setIsScanSucceed] = useState<boolean>(); // Flag to mark failed or successful scan
  const [isDonated, setIsDonated] = useState<boolean>();
  const [isDonationPageVisited, setIsDonationPageVisited] = useState<boolean>();
  const [users, setUsers] = useState<Array<StoredBirthday>>();

  useEffect(() => {
    const onDestroy$ = new Subject<boolean>();
    let timer: ReturnType<typeof setTimeout>;
    concat(
      // initialize settings onload
      retrieveUserSettings(
        [
          "activated",
          "birthdays",
          "donated",
          "location",
          "modal",
          "scanning",
          "scanSuccess",
          "wizardsSettings",
          "donationPageVisited",
        ],
        true,
      ),
      // Listen to storage changes and update changed values
      listenToUserSettings(),
    )
      .pipe(takeUntil(onDestroy$))
      .subscribe((updates) => {
        (Object.keys(updates) as Array<keyof Settings>).forEach((key) => {
          switch (key) {
            case "location":
              return setLocation(updates[key]);
            case "modal":
              return setModal(updates[key]);
            case "scanning":
              // Unlock scanning if needed
              if (+updates[key]) {
                const wait = +updates[key] - DateTime.utc().toMillis();
                timer = setTimeout(
                  () => {
                    storeUserSettings({
                      scanning: 0,
                      scanSuccess: false,
                      // modal: { type: SCAN_ERROR_GENERAL, error: 'Removed infinite scan lock' },
                    });
                  },
                  wait > 0 ? wait : 0,
                );
              } else if (timer) {
                clearTimeout(timer);
              }
              return setIsScanning(!!updates[key]);
            case "scanSuccess":
              // stop timer started by setTimeout
              clearTimeout(timer);
              return setIsScanSucceed(updates[key]);
            case "activated":
              return setIsActive(updates[key]);
            case "donated":
              return setIsDonated(updates[key]);
            case "donationPageVisited": {
              const date = updates[key];
              return setIsDonationPageVisited(Math.abs(date.diffNow("days").days) < 14);
            }
            case "birthdays":
              return setUsers(updates[key]);
            case "wizardsSettings":
              return setWizardsSettings(updates[key]);
            default:
          }
        });
        // Set initDone to true in case it is not `true` yet to mark that variables restoration is done
        !initDone && setInitDone(true);
      });

    return () => {
      clearTimeout(timer);
      onDestroy$.next(true);
      onDestroy$.complete();
    };
  }, []);

  return {
    initDone,
    isActive,
    isDonated,
    isDonationPageVisited,
    isScanning,
    isScanSucceed,
    location,
    modal,
    users,
    wizardsSettings,
  };
}
