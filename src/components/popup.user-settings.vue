<template>

  <b-tabs
      v-if="loaded"
      nav-class="no-wrap"
      content-class="mt-2"
      v-model="tabIndex"
      @activate-tab="updateTabIndex"
  >
    <b-tab :title="'TODAY_BIRTHDAY_TITLE' | translatePipe">
      <today-birthdays
          :update="() => updateTarget(ACTIONS_SET.ENABLE_BADGE)"
      ></today-birthdays>
      <div class="d-flex justify-content-end">
        <b-button size="sm"
                  variant="outline-dark"
                  v-link.close.active="'BY_ME_COFFEE_LINK'"
                  v-translate="'BUY_ME_COFFEE_TITLE'"></b-button>
      </div>
    </b-tab>

    <b-tab :title="'USER_SETTINGS' | translatePipe">
      <b-overlay :show="waiting">

        <div class="d-flex flex-row" style="width: 600px; min-height: 160px">
          <div style="width: 50%" class="d-flex text-info flex-grow-1 mr-2 p-2 border rounded">

            <div class="d-flex flex-grow-1 border"
                 v-if="actionName === ACTIONS_SET.ENABLE_BADGE">
              <b-embed
                  autoplay loop
                  type="video" aspect="4by3">
                <source src="/media/badge.mp4" type="video/mp4">
              </b-embed>
            </div>

            <div v-else-if="actionName === ACTIONS_SET.SELECT_FILE_FORMAT_ICS">
              {{ 'SELECT_ICS_DESCRIPTION' | translatePipe }}
            </div>

            <div v-else-if="actionName === ACTIONS_SET.SELECT_FILE_FORMAT_DELETE_ICS">
              {{ 'SELECT_DELETE_ICS_DESCRIPTION' | translatePipe }}
            </div>

            <div v-else-if="actionName === ACTIONS_SET.SELECT_FILE_FORMAT_CSV">
              {{ 'FILE_FORMAT_CSV_DESCRIPTION' | translatePipe }}
            </div>
          </div>

          <div class="d-flex align-items-start flex-shrink-0 flex-column ml-auto">
            <b-form-radio-group
                class="d-flex flex-nowrap flex-column"
                v-model="actionName"
                @change="updateTarget"
                :options="ACTIONS_DESC">
            </b-form-radio-group>

            <div class="d-flex flex-nowrap mt-auto align-self-stretch">
              <b-button
                  size="sm"
                  variant="outline-success"
                  v-on:click="startGeneration()"
                  v-translate="'GENERATE'"></b-button>
              <leave-feedback-button/>
            </div>
          </div>
        </div>

      </b-overlay>
    </b-tab>
    <b-tab title="TOOLZ">
      <toolz/>
    </b-tab>
  </b-tabs>
</template>

<script lang="ts">

import {
  BButton,
  BCol,
  BContainer,
  BEmbed,
  BFormRadioGroup,
  BOverlay,
  BRow,
  BTab,
  BTabs,
} from 'bootstrap-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import {
  ACTIONS_DESC,
  ACTIONS_SET,
  STORAGE_KEYS,
} from '../constants';
import link from '../directives/link';
import translate from '../directives/translate';
import translatePipe from '../filters/translate';
import { StartGenerationAction } from '../libs/events/actions';
import { sendMessage } from '../libs/events/events';
import {
  retrieveUserSettings,
  storeUserSettings,
} from '../libs/storage/chrome.storage';
import PopupActionDescription from './action-description.vue';
import LeaveFeedbackButton from './leave-feedback.button.vue';
import TodayBirthdays from './today-bdays.vue';
import Toolz from './toolz.vue';

@Component({
  name: 'popup-user-settings',
  filters: {
    translatePipe,
  },
  components: {
    Toolz,
    LeaveFeedbackButton,
    PopupActionDescription,
    'today-birthdays': TodayBirthdays,
    'b-button': BButton,
    'b-form-radio-group': BFormRadioGroup,
    'b-overlay': BOverlay,
    'b-tab': BTab,
    'b-tabs': BTabs,
    'b-container': BContainer,
    'b-row': BRow,
    'b-col': BCol,
    'b-embed': BEmbed,
  },
  directives: {
    translate,
    link,
  },
})
export default class PopupUserSettings extends Vue {
  ACTIONS_SET = ACTIONS_SET;
  ACTIONS_DESC = ACTIONS_DESC;
  actionName: ACTIONS_SET = ACTIONS_SET.SELECT_FILE_FORMAT_ICS;
  waiting = false; // Set true while processing
  tabIndex: number = 1; // Tab index to show
  loaded = false; // Do not display tabs before all the data been fetched

  created() {
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
    storeUserSettings({[STORAGE_KEYS.LAST_ACTIVE_TAB]: activatedTabId});
  }

  updateTarget(val: ACTIONS_SET) {
    storeUserSettings({[STORAGE_KEYS.LAST_SELECTED_ACTION]: val});
  };

  startGeneration() {
    sendMessage(new StartGenerationAction(this.actionName), () => this.waiting = false);
    this.waiting = true;
  }
}

</script>

<style type="scss">
@import '~bootstrap';
@import '~bootstrap-vue';

.no-wrap {
  white-space: nowrap;
  flex-wrap: nowrap;
}

.do-wrap {
  white-space: normal;
}

.action-description {
  display: block;
  margin: 0 0 0 25px;
  padding: 5px 0 0 15px;
}
</style>
