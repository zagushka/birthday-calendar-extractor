import { Location } from 'history';
import {
  useEffect,
  useState,
} from 'react';
import {
  concat,
  Subject,
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScanErrorPayload } from '../events/executed-script.types';
import {
  listenToUserSettings,
  retrieveUserSettings,
} from '../storage/chrome.storage';
import {
  RestoredBirthday,
  Settings,
  WizardsSettings,
} from '../storage/storaged.types';

/**
 * Return always updated stored values
 */
export function useCurrentStatus() {
  const [initDone, setInitDone] = useState<boolean>(false);
  const [location, setLocation] = useState<Location>();
  const [wizardsSettings, setWizardsSettings] = useState<WizardsSettings>();
  const [isActive, setIsActive] = useState<boolean>(); // is Active
  const [modal, setModal] = useState<ScanErrorPayload>(); // is Error
  const [isScanning, setIsScanning] = useState<boolean>(); // is Scanning in process
  const [isScanSucceed, setIsScanSucceed] = useState<boolean>(); // Flag to mark failed or successful scan
  const [users, setUsers] = useState<Array<RestoredBirthday>>();

  useEffect(() => {
    const onDestroy$ = new Subject<boolean>();
    concat(
      // initialize settings onload
      retrieveUserSettings([
        'wizardsSettings',
        'modal',
        'birthdays',
        'activated',
        'scanning',
        'scanSuccess',
        'location',
      ]),
      // Listen to storage changes and update changed values
      listenToUserSettings(),
    )
      .pipe(takeUntil(onDestroy$))
      .subscribe((updates) => {
        (Object.keys(updates) as Array<keyof Settings>)
          .forEach((key) => {
            switch (key) {
              case 'location':
                return setLocation(updates[key]);
              case 'modal':
                return setModal(updates[key]);
              case 'scanning':
                return setIsScanning(updates[key]);
              case 'scanSuccess':
                return setIsScanSucceed(updates[key]);
              case 'activated':
                return setIsActive(updates[key]);
              case 'birthdays':
                return setUsers(updates[key]);
              case 'wizardsSettings':
                return setWizardsSettings(updates[key]);
            }
          });
        // Set initDone to true in case it is not `true` yet to mark that variables restoration is done
        !initDone && setInitDone(true);
      });

    return () => {
      onDestroy$.next(true);
      onDestroy$.complete();
    };
  }, []);

  return {initDone, location, wizardsSettings, isActive, modal, isScanning, isScanSucceed, users};
}
