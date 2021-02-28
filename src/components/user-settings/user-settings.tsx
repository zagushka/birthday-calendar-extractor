import React, {
  FunctionComponent,
  useContext,
  useEffect,
} from 'react';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { CurrentStatusContext } from '../../context/current-status.context';
import { storeUserSettings } from '../../libs/storage/chrome.storage';
import BirthdaysList from '../birthdays-list/birthdays-list';
import { FirstScan } from '../first-scan';
import SwitchModals from '../modals/switch-modals';
import SelectWizard from '../wizards/select-wizard';

const UserSettings: FunctionComponent = () => {
  const {
    isActive,
    initDone,
    location: restoredLocation,
  } = useContext(CurrentStatusContext);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    !!restoredLocation && storeUserSettings({location});
  }, [location]);

  /**
   * The moment `initDone`, `restoredLocation` been fetched as well
   * This Effect have no deps on `restoredLocation` because it will be changing
   * but initDone fired only twice (`false` at the beginning and `true`
   * when all the settings been fetched from storage)
   */
  useEffect(() => {
    initDone && history.replace(restoredLocation);
  }, [initDone]);

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
        <Route path='/'>
          <Redirect to='/calendar'/>
        </Route>
      </Switch>
    </>
  );
};

export default UserSettings;
