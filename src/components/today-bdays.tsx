import { DateTime } from 'luxon';
import React, {
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import { Subject } from 'rxjs';
import {
  startWith,
  switchMapTo,
  takeUntil,
} from 'rxjs/operators';
import { ACTION } from '../constants';
import handleLink from '../filters/handleLink';
import { translate } from '../filters/translate';
import { listenTo } from '../libs/events/events';
import {
  getBirthdaysForDate,
  RestoredBirthdays,
} from '../libs/storage/chrome.storage';

const TodayBirthdays: FunctionComponent = () => {
  const onDestroy$: Subject<boolean> = new Subject();
  const [users, setUsers] = useState<Array<RestoredBirthdays>>([]);

  useEffect(() => {
    listenTo(ACTION.ALARM_NEW_DAY, ACTION.UPDATE_BADGE) // Update when date changes
      .pipe(
        takeUntil(onDestroy$),
        startWith(true), // Display on mount
        switchMapTo(getBirthdaysForDate(DateTime.local())),
      )
      .subscribe(u => setUsers(u));

    // Before destroy
    return () => {
      onDestroy$.next(true);
      onDestroy$.complete();
    };
  }, []);


  return <div className='m-2' style={{minHeight: '80px'}}>
    {users.length && <p>
      <strong>{translate('TODAY_NO_BIRTHDAYS_TITLE')}</strong>
    </p>}

    <ul className='text-nowrap' style={{listStyleType: 'none', margin: 0, padding: 0}}>
      {users.map(user => (
        <li key={user.href}>
          <a onClick={(e) => handleLink(e, user.href)}>{user.name}</a>
        </li>
      ))}

    </ul>
  </div>;

};

export default TodayBirthdays;
