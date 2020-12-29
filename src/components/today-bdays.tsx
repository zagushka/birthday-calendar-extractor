import { DateTime } from 'luxon';
import React, {
  FunctionComponent,
  useContext,
} from 'react';
import { Button } from 'react-bootstrap';
import { ErrorsContext } from '../context/errors.context';
import { TodayUsersContext } from '../context/today-users.context';
import handleLink from '../filters/handleLink';
import { translate } from '../filters/translate';

const TodayBirthdays: FunctionComponent = () => {
  const {users, isActive, useDate, date} = useContext(TodayUsersContext);
  console.log('TodayBirthdays UPDATED', users, isActive);

  const {error} = useContext(ErrorsContext);
  console.log('SettingsContext UPDATED', error);

  if (!isActive) {
    // Show button to activate
  } else {
    // Show navigation
    if (users.length) {
      // Display list of birthdays today
    } else {
      // Display "no birthdays today"
    }
    // Show button to deactivate
  }

  return (<div className='m-2' style={{minHeight: '80px'}}>

    <Button onClick={() => useDate(date.minus({day: 1}))}> &lt; </Button>
    {date.toLocaleString({weekday: 'short', month: 'short', day: '2-digit'})}
    <Button onClick={() => useDate(date.plus({day: 1}))}> &gt; </Button>

    {!users.length && isActive && <p>
      <strong>{translate('TODAY_NO_BIRTHDAYS_TITLE')}</strong>
    </p>}

    <ul className='text-nowrap' style={{listStyleType: 'none', margin: 0, padding: 0}}>
      {users.map(user => (
        <li key={user.href}>
          <a onClick={(e) => handleLink(e, user.href)}>{user.name}</a>
        </li>
      ))}
    </ul>
  </div>);
};

export default TodayBirthdays;
