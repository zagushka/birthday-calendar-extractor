import React from 'react';
import {
  Tab,
  Tabs,
} from 'react-bootstrap';
import { pluck } from 'rxjs/operators';

import { STORAGE_KEYS } from '../../constants';
import translate from '../../filters/translate';
import {
  retrieveUserSettings,
  storeUserSettings,
} from '../../libs/storage/chrome.storage';
import SelectAction from '../select-action';
import TodayBirthdays from '../today-bdays';
import Toolz from '../toolz';
import './user-serrings.scss';

interface UserSettingsStore {
  tabIndex: string;
  waiting: boolean;// Set true while processing
  loaded: boolean; // Do not display tabs before all the data been fetched
}

export default class UserSettings extends React.Component<any, UserSettingsStore> {

  state: UserSettingsStore = {
    tabIndex: 'USER_SETTINGS',
    waiting: false,
    loaded: false,
  };

  componentDidMount() {
    retrieveUserSettings([
      STORAGE_KEYS.LAST_ACTIVE_TAB,
    ])
      .pipe(pluck(STORAGE_KEYS.LAST_ACTIVE_TAB))
      .subscribe((tabIndex) => this.setState({tabIndex, loaded: true}));
  }

  updateTabIndex(tabIndex: string) {
    storeUserSettings({[STORAGE_KEYS.LAST_ACTIVE_TAB]: tabIndex}, true);
    this.setState({tabIndex});
  }

  render() {
    return <>
      <Tabs
        v-if='loaded'
        nav-class='no-wrap'
        content-class='mt-2'
        activeKey={this.state.tabIndex}
        defaultActiveKey={this.state.tabIndex}
        onSelect={(tabIndex) => this.updateTabIndex(tabIndex)}
      >
        <Tab
          title={translate('TODAY_BIRTHDAY_TITLE')}
          eventKey='TODAY_BIRTHDAY_TITLE'
        >
          <TodayBirthdays/>
          <div className='d-flex'>
            {/*    <toggle-show-badge-button v-on:set-waiting='setWaiting'/>*/}
          </div>
        </Tab>

        <Tab
          title={translate('USER_SETTINGS')}
          eventKey='USER_SETTINGS'
        >
          {/*<Overlay show={this.waiting}>*/}

          <SelectAction/>
          {/*</Overlay>*/}
        </Tab>
        <Tab title='TOOLZ' eventKey='TOOLZ'>
          <Toolz/>
        </Tab>
      </Tabs>
    </>;
  }
}
