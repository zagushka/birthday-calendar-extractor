import History from 'history';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { LoadingContext } from '../../context/loading.context';
import { TodayUsersContext } from '../../context/today-users.context';
import {
  retrieveUserSettings,
  storeUserSettings,
} from '../../libs/storage/chrome.storage';
import BirthdaysList from '../birthdays-list/birthdays-list';
import { FirstScan } from '../first-scan';
import SwitchModals from '../modals/switch-modals';
import SelectWizard from '../wizards/select-wizard';

const UserSettings: FunctionComponent = () => {
  const {isLoading} = useContext(LoadingContext);
  const {isActive} = useContext(TodayUsersContext);
  const loaded = !isLoading('SETTINGS');
  const history = useHistory();
  const [restoredLocation, setRestoredLocation] = useState<History.Location>();

  const location = useLocation();

  useEffect(() => {
    if (restoredLocation) {
      storeUserSettings({location: location});
    }
  }, [location]);

  // Update location on startup
  useEffect(() => {
    retrieveUserSettings(['location'])
      .subscribe(update => {
        setRestoredLocation(update.location);
        history.replace(update.location);
      });
  }, []);


  return (
    <>
      <SwitchModals/>
      {loaded && restoredLocation &&
      <Switch>
        <Route path='/activate'>
          <FirstScan/>
        </Route>
        <Route path='/export/:action?'>
          <SelectWizard/>
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
