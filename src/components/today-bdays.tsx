import { DateTime } from 'luxon';
import React from 'react';
import { Subject } from 'rxjs';
import {
  startWith,
  switchMapTo,
  takeUntil,
} from 'rxjs/operators';
import { ACTION } from '../constants';
import handleLink from '../filters/handleLink';
import translate from '../filters/translate';
import { listenTo } from '../libs/events/events';
import {
  getBirthdaysForDate,
  RestoredBirthdays,
} from '../libs/storage/chrome.storage';

interface TodayBirthdaysState {
  users: Array<RestoredBirthdays>;
}

export default class TodayBirthdays extends React.Component<any, TodayBirthdaysState> {
  onDestroy$: Subject<boolean> = new Subject();

  constructor(props: any) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentWillUnmount() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  componentDidMount() {
    listenTo(ACTION.ALARM_NEW_DAY, ACTION.UPDATE_BADGE) // Update when date changes
      .pipe(
        takeUntil(this.onDestroy$),
        startWith(true), // Display on mount
        switchMapTo(getBirthdaysForDate(DateTime.local())),
      )
      .subscribe(users => this.setState({users}));
  }

  render() {
    return <div className='m-2' style={{minHeight: '80px'}}>

      {this.state.users.length && <p>
        <strong>{translate('TODAY_NO_BIRTHDAYS_TITLE')}</strong>
      </p>}

      <ul className='text-nowrap' style={{listStyleType: 'none', margin: 0, padding: 0}}>
        {this.state.users.map(user => (
          <li key={user.href}>
            <a onClick={(e) => handleLink(e, user.href)}>{user.name}</a>
          </li>
        ))}

      </ul>
    </div>;
  }
}
