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
  const [wizardsSettings, setWizardsSettings] = useState<WizardsSettings>();
  const [isActive, setIsActive] = useState<boolean>(false); // is Active
  const [modal, setModal] = useState<ScanErrorPayload>(null); // is Error
  const [isScanning, setIsScanning] = useState<boolean>(false); // is Scanning in process
  const [isScanSucceed, setIsScanSucceed] = useState<boolean>(true); // Flag to mark failed or successful scan
  const [users, setUsers] = useState<Array<RestoredBirthday>>([]);

  useEffect(() => {
    const onDestroy$ = new Subject<boolean>();
    concat(
      retrieveUserSettings([
        'wizardsSettings',
        'modal',
        'birthdays',
        'activated',
        'scanning',
        'scanSuccess',
      ]), // initialize settings onload
      listenToUserSettings(),
    )
      .pipe(takeUntil(onDestroy$))
      .subscribe((updates) => {
        (Object.keys(updates) as Array<keyof Settings>)
          .forEach((key) => {
            switch (key) {
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
      });

    return () => {
      onDestroy$.next(true);
      onDestroy$.complete();
    };
  }, []);

  return {wizardsSettings, isActive, modal, isScanning, isScanSucceed, users};
}
