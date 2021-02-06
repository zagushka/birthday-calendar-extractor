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
import {
  listenToUserSettings,
  RestoredBirthday,
  retrieveUserSettings,
  Settings,
} from '../libs/storage/chrome.storage';

interface TodayUsersContextInterface {
  isActive: boolean;
  isScanning: boolean;
  isScanSucceed: boolean;
  users: Array<RestoredBirthday>;
}

export const TodayUsersContext = React.createContext<TodayUsersContextInterface>({
  isActive: false,
  isScanning: false,
  isScanSucceed: true,
  users: [],
});

const TodayUsersContextProvider: FunctionComponent = (props) => {

  const [isActive, setIsActive] = useState<boolean>(false); // is Active
  const [isScanning, setIsScanning] = useState<boolean>(false); // is Scanning in process
  const [isScanSucceed, setIsScanSucceed] = useState<boolean>(true); // Flag to mark failed or successful scan
  const [users, setUsers] = useState<Array<RestoredBirthday>>([]);

  useEffect(() => {
    const onDestroy$ = new Subject();

    concat(
      retrieveUserSettings(['birthdays', 'activated', 'scanning', 'scanSuccess']), // Get initial settings
      listenToUserSettings().pipe(takeUntil(onDestroy$)), // Listen to UserSettings changes
    )
      .subscribe((updates) => {
        (Object.keys(updates) as Array<keyof Settings>)
          .forEach((key) => {
            switch (key) {
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
    };
  }, []);

  return <TodayUsersContext.Provider value={{
    isActive,
    isScanning,
    isScanSucceed,
    users,
  }}>
    {props.children}
  </TodayUsersContext.Provider>;
};

export default TodayUsersContextProvider;
