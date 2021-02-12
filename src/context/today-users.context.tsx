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
  error: [string, Array<string>] | null;
  isActive: boolean;
  isScanning: boolean;
  isScanSucceed: boolean;
  users: Array<RestoredBirthday>;
}

export const TodayUsersContext = React.createContext<TodayUsersContextInterface>({
  error: null,
  isActive: false,
  isScanning: false,
  isScanSucceed: true,
  users: [],
});

const TodayUsersContextProvider: FunctionComponent = (props) => {

  const [isActive, setIsActive] = useState<boolean>(false); // is Active
  const [error, setError] = useState<[string, Array<string>] | null>(null); // is Error
  const [isScanning, setIsScanning] = useState<boolean>(false); // is Scanning in process
  const [isScanSucceed, setIsScanSucceed] = useState<boolean>(true); // Flag to mark failed or successful scan
  const [users, setUsers] = useState<Array<RestoredBirthday>>([]);

  useEffect(() => {
    const onDestroy$ = new Subject();

    concat(
      retrieveUserSettings(['error', 'birthdays', 'activated', 'scanning', 'scanSuccess']), // Get initial settings
      listenToUserSettings().pipe(takeUntil(onDestroy$)), // Listen to UserSettings changes
    )
      .subscribe((updates) => {
        (Object.keys(updates) as Array<keyof Settings>)
          .forEach((key) => {
            switch (key) {
              case 'error':
                return setError(updates[key]);
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
    error,
    isActive,
    isScanning,
    isScanSucceed,
    users,
  }}>
    {props.children}
  </TodayUsersContext.Provider>;
};

export default TodayUsersContextProvider;
