import React, {
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import {
  concat,
  Subject,
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScanErrorPayload } from '../libs/events/executed-script.types';
import {
  listenToUserSettings,
  RestoredBirthday,
  retrieveUserSettings,
  Settings,
  storeUserSettings,
} from '../libs/storage/chrome.storage';

interface TodayUsersContextInterface {
  modal: ScanErrorPayload | null;
  isActive: boolean;
  isScanning: boolean;
  isScanSucceed: boolean;
  users: Array<RestoredBirthday>;
}

export const TodayUsersContext = React.createContext<TodayUsersContextInterface>({
  modal: null,
  isActive: false,
  isScanning: false,
  isScanSucceed: true,
  users: [],
});

const TodayUsersContextProvider: FunctionComponent = (props) => {

  const [isActive, setIsActive] = useState<boolean>(false); // is Active
  const [modal, setModal] = useState<ScanErrorPayload>(null); // is Error
  const [isScanning, setIsScanning] = useState<boolean>(false); // is Scanning in process
  const [isScanSucceed, setIsScanSucceed] = useState<boolean>(true); // Flag to mark failed or successful scan
  const [users, setUsers] = useState<Array<RestoredBirthday>>([]);

  useEffect(() => {
    const onDestroy$ = new Subject();

    concat(
      retrieveUserSettings(['modal', 'birthdays', 'activated', 'scanning', 'scanSuccess']), // Get initial settings
      listenToUserSettings().pipe(takeUntil(onDestroy$)), // Listen to UserSettings changes
    )
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
            }
          });
      });

    return () => {
      onDestroy$.next(true);
      onDestroy$.complete();
      storeUserSettings({modal: null});
    };
  }, []);

  return <TodayUsersContext.Provider value={{
    modal,
    isActive,
    isScanning,
    isScanSucceed,
    users,
  }}>
    {props.children}
  </TodayUsersContext.Provider>;
};

export default TodayUsersContextProvider;
