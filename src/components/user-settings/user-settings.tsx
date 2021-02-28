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
import { CurrentStatusContext } from '../../context/current-status.context';
import {
  retrieveUserSettings,
  storeUserSettings,
} from '../../libs/storage/chrome.storage';
import BirthdaysList from '../birthdays-list/birthdays-list';
import { FirstScan } from '../first-scan';
import SwitchModals from '../modals/switch-modals';
import SelectWizard from '../wizards/select-wizard';

const UserSettings: FunctionComponent = () => {
  const {isActive} = useContext(CurrentStatusContext);
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
      {restoredLocation &&
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
