import {
  Button,
  Col,
  Container,
  Form,
  Overlay,
  Row,
  Tab,
  Tabs,
} from 'react-bootstrap';
import React from 'react';
import './user-serrings.scss';

import {
  ACTIONS_DESC,
  ACTIONS_SET,
  STORAGE_KEYS,
} from '../../constants';
import link from '../../directives/link';
import translate from '../../directives/translate';
import translateFilter from '../../filters/translate';
import { StartGenerationAction } from '../../libs/events/actions';
import { sendMessage } from '../../libs/events/events';
import {
  retrieveUserSettings,
  storeUserSettings,
} from '../../libs/storage/chrome.storage';
import PopupActionDescription from '../action-description.vue';
import LeaveFeedbackButton from '../leave-feedback.button.vue';
import TodayBirthdays from '../today-bdays.vue';
import ToggleShowBadgeButton from '../toggle-show-badge.button.vue';
import Toolz from '../toolz.vue';

// @Component({
//   name: 'popup-user-settings',
//   filters: {
//     translatePipe: translateFilter,
//   },
//   components: {
//     ToggleShowBadgeButton,
//     Toolz,
//     LeaveFeedbackButton,
//     PopupActionDescription,
//     'today-birthdays': TodayBirthdays,
//     'b-form-radio-group': BFormRadioGroup,
//     'b-overlay': BOverlay,
//     'b-tab': BTab,
//     'b-tabs': BTabs,
//     'b-container': BContainer,
//     'b-row': BRow,
//     'b-col': BCol,
//     'b-embed': BEmbed,
//   },
//   directives: {
//     translate,
//     link,
//   },
// })
export default class UserSettings extends React.Component<any, any> {
  ACTIONS_SET = ACTIONS_SET;
  ACTIONS_DESC = ACTIONS_DESC;
  actionName: ACTIONS_SET = ACTIONS_SET.SELECT_FILE_FORMAT_ICS;
  waiting = false; // Set true while processing
  tabIndex = 1; // Tab index to show
  loaded = false; // Do not display tabs before all the data been fetched

  componentDidMount() {
    retrieveUserSettings([
      STORAGE_KEYS.LAST_ACTIVE_TAB,
      STORAGE_KEYS.LAST_SELECTED_ACTION,
    ])
      .subscribe((response) => {
          this.actionName = response[STORAGE_KEYS.LAST_SELECTED_ACTION];
          this.tabIndex = response[STORAGE_KEYS.LAST_ACTIVE_TAB];
          this.loaded = true;
        },
      );
  }

  updateTabIndex(activatedTabId: number) {
    storeUserSettings({[STORAGE_KEYS.LAST_ACTIVE_TAB]: activatedTabId}, true);
  }

  updateTarget(val: ACTIONS_SET) {
    storeUserSettings({[STORAGE_KEYS.LAST_SELECTED_ACTION]: val}, true);
  };

  startGeneration() {
    sendMessage(new StartGenerationAction(this.actionName))
      .subscribe(() => this.setWaiting(false));
    this.setWaiting(true);
  }

  setWaiting(status: boolean) {
    this.waiting = status;
  }

  render() {
    return <>
      {/*  <b-tabs*/}
      {/*    v-if="loaded"*/}
      {/*    nav-class="no-wrap"*/}
      {/*    content-class="mt-2"*/}
      {/*    v-model="tabIndex"*/}
      {/*    @activate-tab="updateTabIndex"*/}
      {/*>*/}
      {/*  <b-tab :title="'TODAY_BIRTHDAY_TITLE' | translatePipe">*/}

      {/*  <today-birthdays*/}
      {/*        :update="() => updateTarget(ACTIONS_SET.ENABLE_BADGE)"*/}
      {/*></today-birthdays>*/}

      {/*  <div class="d-flex">*/}
      {/*    <toggle-show-badge-button v-on:set-waiting="setWaiting"/>*/}
      {/*  </div>*/}

      {/*</b-tab>*/}

      {/*  <b-tab :title="'USER_SETTINGS' | translatePipe">*/}
      {/*  <b-overlay :show="waiting">*/}

      {/*  <div class="d-flex flex-row" style="width: 600px; min-height: 160px">*/}
      {/*    <div style="width: 50%" class="d-flex text-info flex-grow-1 mr-2 p-2 border rounded">*/}

      {/*      <div class="d-flex flex-grow-1 border"*/}
      {/*           v-if="actionName === ACTIONS_SET.ENABLE_BADGE">*/}
      {/*        <b-embed*/}
      {/*          autoplay loop*/}
      {/*          type="video" aspect="4by3">*/}
      {/*          <source src="/media/badge.mp4" type="video/mp4">*/}
      {/*        </b-embed>*/}
      {/*      </div>*/}

      {/*      <div v-else-if="actionName === ACTIONS_SET.SELECT_FILE_FORMAT_ICS">*/}
      {/*        {{ 'SELECT_ICS_DESCRIPTION' | translatePipe }}*/}
      {/*      </div>*/}

      {/*      <div v-else-if="actionName === ACTIONS_SET.SELECT_FILE_FORMAT_DELETE_ICS">*/}
      {/*        {{ 'SELECT_DELETE_ICS_DESCRIPTION' | translatePipe }}*/}
      {/*      </div>*/}

      {/*      <div v-else-if="actionName === ACTIONS_SET.SELECT_FILE_FORMAT_CSV">*/}
      {/*        {{ 'FILE_FORMAT_CSV_DESCRIPTION' | translatePipe }}*/}
      {/*      </div>*/}
      {/*    </div>*/}

      {/*    <div class="d-flex align-items-start flex-shrink-0 flex-column ml-auto">*/}
      <Form>
        {ACTIONS_DESC.map(action => (
          <Form.Check
            type='radio'
            key={action.value}
          />
        ))}
        {/*  className="d-flex flex-nowrap flex-column"*/}
        {/*  v-model="actionName"*/}
        {/*@change="updateTarget"*/}
        {/*:options="ACTIONS_DESC">*/}
      </Form>
      {/*    </b-form-radio-group>*/}

      {/*    <div class="d-flex flex-nowrap mt-auto align-self-stretch">*/}
      <Button
        size='sm'
        variant='outline-success'
        onClick={() => this.startGeneration()}
      >{translateFilter('GENERATE')}</Button>
      {/*<leave-feedback-button/>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*</b-overlay>*/}
      {/*</b-tab>*/}
      {/*  <b-tab title="TOOLZ">*/}
      {/*    <toolz/>*/}
      {/*  </b-tab>*/}
      {/*</b-tabs>*/}
    </>;
  }
}
