import React, {
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import {
  Tab,
  Tabs,
} from 'react-bootstrap';
import { pluck } from 'rxjs/operators';

import { STORAGE_KEYS } from '../../constants';
import { translateString } from '../../filters/translate';
import {
  retrieveUserSettings,
  storeUserSettings,
} from '../../libs/storage/chrome.storage';
import SelectAction from '../select-action';
import TodayBirthdays from '../today-bdays';
import ToggleShowBadgeButton from '../toggle-show-badge.button';
import Toolz from '../toolz';
import './user-serrings.scss';

const UserSettings: FunctionComponent = () => {

  const [tabIndex, setTabIndex] = useState<string>('USER_SETTINGS');
  const [loaded, setLoaded] = useState<boolean>(false); // Do not display tabs before all the data been fetched
  const [waiting, setWaiting] = useState<boolean>(false); // Set true while processing

  useEffect(() => {
    retrieveUserSettings([
      STORAGE_KEYS.LAST_ACTIVE_TAB,
    ])
      .pipe(pluck(STORAGE_KEYS.LAST_ACTIVE_TAB))
      .subscribe((storedTabIndex) => {
        setLoaded(true);
        setTabIndex(storedTabIndex);
      });
  });

  const updateTabIndex = (index: string) => {
    storeUserSettings({[STORAGE_KEYS.LAST_ACTIVE_TAB]: index}, true);
    setTabIndex(index);
  };

  return <>
    {loaded && <Tabs
      className='no-wrap'
      activeKey={tabIndex}
      onSelect={updateTabIndex}
    >
      <Tab
        title={translateString('TODAY_BIRTHDAY_TITLE')}
        eventKey='TODAY_BIRTHDAY_TITLE'
      >
        <TodayBirthdays/>
        <div className='d-flex'>
          <ToggleShowBadgeButton onWaiting={setWaiting}/>
        </div>
      </Tab>

      <Tab
        title={translateString('USER_SETTINGS')}
        eventKey='USER_SETTINGS'
      >
        {/*<Overlay show={this.waiting}>*/}
        <SelectAction/>
        {/*</Overlay>*/}
      </Tab>
      <Tab title='TOOLZ' eventKey='TOOLZ'>
        <Toolz/>
      </Tab>
    </Tabs>}
  </>;
};

export default UserSettings;
