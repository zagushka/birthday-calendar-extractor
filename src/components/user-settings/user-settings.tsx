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
import Calendar from '../calendar/calendar';
import DevTools from '../dev-tools';
import { BottomMenu } from '../bottom-naviagtion/bottom-navigation';
import Layout from '../layout/layout';
import SwitchModals from '../modals/switch-modals';
import { Scan } from '../scan/scan';
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
      <Layout.Wrapper>
        <Switch>

          <Route path='/activate'>
            <Scan/>
          </Route>

          <Route path='/export/:action?'>
            {isActive ? <SelectWizard/> : <Redirect to='/activate'/>}
          </Route>

          <Route exact path='/calendar'>
            {isActive ? <Calendar/> : <Redirect to='/activate'/>}
          </Route>

          {isDevelopment && <Route path='/dev-tools'>
            <DevTools/>
          </Route>}

          <Route exact path='/'>
            {'/' === restoredLocation.pathname ?
              <Redirect to='/calendar'/> :
              <Redirect to={restoredLocation}/>
            }
          </Route>
          <Redirect to='/'/>
        </Switch>
        <Layout.Footer>
          <BottomMenu/>
        </Layout.Footer>
      </Layout.Wrapper>
    </>
  );
};

export default UserSettings;
