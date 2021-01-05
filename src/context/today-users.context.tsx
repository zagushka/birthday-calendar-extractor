import { DateTime } from 'luxon';
import React, {
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import { Subject } from 'rxjs';
import {
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import {
  ACTION,
  STORAGE_KEYS,
} from '../constants';
import { listenTo } from '../libs/events/events';
import {
  filterBirthdaysForDate,
  getBirthdaysForDate,
  RestoredBirthday,
  retrieveUserSettings,
} from '../libs/storage/chrome.storage';

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
  const [allUsers, setAllUsers] = useState<Array<RestoredBirthday>>([]);
  const [users, setUsers] = useState<Array<RestoredBirthday>>([]);
  const [date, setDate] = useState<DateTime>(DateTime.local());

  const setDateHandler = (d: DateTime) => setDate(d);
  const activate = () => setIsActive(true);
  const deactivate = () => setIsActive(false);

  useEffect(() => {
    // Fetch data
    retrieveUserSettings([STORAGE_KEYS.BIRTHDAYS, STORAGE_KEYS.BADGE_ACTIVE])
      .subscribe((data) => {
        setIsActive(data[STORAGE_KEYS.BADGE_ACTIVE]);
        setAllUsers(data[STORAGE_KEYS.BIRTHDAYS]);
      });
  }, []);

  // Update badge icon, move it to background
  useEffect(() => {
    const onDestroy$ = new Subject();
    listenTo(ACTION.ALARM_NEW_DAY, ACTION.BADGE_UPDATE) // Update when date changes
      .pipe(
        takeUntil(onDestroy$),
        startWith(true), // Display on mount
        switchMap(() => getBirthdaysForDate(DateTime.local())),
      )
      .subscribe(u => {
        // setUsers(u)
      });

    // Before destroy
    return () => {
      onDestroy$.next(true);
      onDestroy$.complete();
    };
  }, []);

  useEffect(() => {
    setUsers(isActive ? filterBirthdaysForDate(allUsers, date) : []);
  }, [allUsers, isActive, date]);

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
