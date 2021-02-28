import React, {
  FunctionComponent,
  useContext,
  useEffect,
} from 'react';
import {
  Redirect,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom';
import { isDevelopment } from '../../constants';
import { CurrentStatusContext } from '../../context/current-status.context';
import { storeUserSettings } from '../../libs/storage/chrome.storage';
import BirthdaysList from '../birthdays-list/birthdays-list';
import DevTools from '../dev-tools';
import { FirstScan } from '../first-scan';
import SwitchModals from '../modals/switch-modals';
import SelectWizard from '../wizards/select-wizard';

const UserSettings: FunctionComponent = () => {
  const {
    isActive,
    initDone,
    location: restoredLocation,
  } = useContext(CurrentStatusContext);

  const location = useLocation();

  /**
   * Start storing new location to the storage
   * after initDone and restoredLocation been fetched
   */
  useEffect(() => {
    !!restoredLocation && storeUserSettings({location});
  }, [location]);

  if (!initDone) {
    return (<></>);
  }

  return (
    <>
      <SwitchModals/>
      <Switch>
        <Route path='/activate'>
          <FirstScan/>
        </Route>
        <Route path='/export/:action?'>
          <SelectWizard/>
        </Route>
        <Route exact path='/calendar'>
          {isActive ? <BirthdaysList/> : <Redirect to='/activate'/>}
        </Route>
        {isDevelopment && <Route path='/dev-tools'>
          <DevTools/>
        </Route>}
        <Route exact path='/'>
          {'/' === restoredLocation.pathname ?
            <Redirect to='/export'/> :
            <Redirect to={restoredLocation}/>
          }
        </Route>
      </Switch>
    </>
  );
};

export default UserSettings;
