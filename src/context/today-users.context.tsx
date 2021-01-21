import { DateTime } from 'luxon';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { listenTo } from '../libs/events/events';
import { BIRTHDAYS_EXTRACTION_COMPLETE } from '../libs/events/types';
import {
  RestoredBirthday,
  retrieveUserSettings,
} from '../libs/storage/chrome.storage';
import { LoadingContext } from './loading.context';

interface TodayUsersContextInterface {
  isActive: boolean;
  activate: () => void;
  deactivate: () => void;

  users: Array<RestoredBirthday>;
  date: DateTime;
  useDate: (date: DateTime) => void;
}

export const TodayUsersContext = React.createContext<TodayUsersContextInterface>({
  isActive: false,
  activate: () => {
  },
  deactivate: () => {
  },
  users: [],
  date: DateTime.local(),
  useDate: () => {
  },
});

const TodayUsersContextProvider: FunctionComponent = (props) => {

  const [isActive, setIsActive] = useState<boolean>(false); // is Active
  const [users, setUsers] = useState<Array<RestoredBirthday>>([]);
  const [date, setDate] = useState<DateTime>(DateTime.local());
  const [status, setStatus] = useState<boolean>();
  const {stopLoading} = useContext(LoadingContext);

  const setDateHandler = (d: DateTime) => setDate(d);
  const activate = () => setIsActive(true);
  const deactivate = () => setIsActive(false);

  useEffect(() => {
    console.log('statusChanged');
    // Fetch data
    retrieveUserSettings(['birthdays', 'badgeActive'])
      .subscribe(({birthdays, badgeActive}) => {
        setIsActive(badgeActive);
        setUsers(birthdays);
      });
  }, [status]);

  useEffect(() => {
    const onDestroy$ = new Subject();
    // Listen to Badge Enabled / Disabled events
    listenTo(BIRTHDAYS_EXTRACTION_COMPLETE)
      .pipe(
        takeUntil(onDestroy$),
      )
      .subscribe(() => {
        setStatus(true);
        stopLoading('WAITING_FOR_BADGE_TO_BE_ENABLED');
      });

    return () => {
      onDestroy$.next(null);
      onDestroy$.complete();
    };
  }, []);

  // useEffect(() => {
  //   setUsers(isActive ? filterBirthdaysForDate(users, date) : []);
  // }, [users, isActive, date]);

  return <TodayUsersContext.Provider value={{
    isActive,
    users,
    date,
    deactivate,
    activate,
    useDate: setDateHandler,
  }}>
    {props.children}
  </TodayUsersContext.Provider>;
};

export default TodayUsersContextProvider;
