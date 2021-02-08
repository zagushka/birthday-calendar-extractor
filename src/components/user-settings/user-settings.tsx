import React, {
  FunctionComponent,
  useContext,
} from 'react';

import {
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { LoadingContext } from '../../context/loading.context';
import { TodayUsersContext } from '../../context/today-users.context';
import BirthdaysList from '../birthdays-list/birthdays-list';
import { FirstScan } from '../first-scan';
import SelectWizard from '../wizards/select-wizard';

const UserSettings: FunctionComponent = () => {
  const {isLoading} = useContext(LoadingContext);
  const {isActive} = useContext(TodayUsersContext);
  const loaded = !isLoading('SETTINGS');

  return (
    <>
      {loaded &&
      <Switch>
        <Route path='/error'>
        </Route>
        <Route path='/activate'>
          <FirstScan/>
        </Route>
        <Route path='/export'>
          {isActive ? <SelectWizard/> : <Redirect to='/activate'/>}
        </Route>
        <Route exact path='/'>
          {isActive ? <BirthdaysList/> : <Redirect to='/activate'/>}
        </Route>
        <Route>
          <Redirect to='/'/>
        </Route>
      </Switch>
      }
    </>
  );
};

export default UserSettings;
