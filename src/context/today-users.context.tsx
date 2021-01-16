import { DateTime } from 'luxon';
import React, {
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import {
  filterBirthdaysForDate,
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
    retrieveUserSettings(['birthdays', 'badgeActive'])
      .subscribe(({birthdays, badgeActive}) => {
        setIsActive(badgeActive);
        setAllUsers(birthdays);
      });
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
