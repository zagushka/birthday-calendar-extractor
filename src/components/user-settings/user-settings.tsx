import React from 'react';
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

interface UserSettingsState {
  tabIndex: string;
  waiting: boolean;// Set true while processing
  loaded: boolean; // Do not display tabs before all the data been fetched
}

export default class UserSettings extends React.Component<any, UserSettingsState> {

  constructor(props: any) {
    super(props);
    this.state = {
      tabIndex: 'USER_SETTINGS',
      waiting: false,
      loaded: false,
    };
  }

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
      {this.state.loaded && <Tabs
        className='no-wrap'
        activeKey={this.state.tabIndex}
        defaultActiveKey={this.state.tabIndex}
        onSelect={(tabIndex) => this.updateTabIndex(tabIndex)}
      >
        <Tab
          title={translateString('TODAY_BIRTHDAY_TITLE')}
          eventKey='TODAY_BIRTHDAY_TITLE'
        >
          <TodayBirthdays/>
          <div className='d-flex'>
            <ToggleShowBadgeButton onWaiting={(s) => this.setState({waiting: s})}/>
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
  }
}
