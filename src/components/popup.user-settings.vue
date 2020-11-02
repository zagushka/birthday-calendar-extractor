<template>

  <b-tabs
      nav-class="no-wrap"
      content-class="mt-2"
      v-model="tabIndex"
      @activate-tab="updateTabIndex"
  >
    <b-tab :title="'TODAY_BIRTHDAY_TITLE' | translatePipe">
      <today-birthdays></today-birthdays>
      <div class="d-flex justify-content-end">
        <b-button size="sm"
                  variant="outline-dark"
                  v-link.close.active="'BY_ME_COFFEE_LINK'"
                  v-translate="'BUY_ME_COFFEE_TITLE'"></b-button>
      </div>
    </b-tab>

    <b-tab :title="'USER_SETTINGS' | translatePipe">
      <b-overlay :show="waiting">

        <div class="d-flex flex-row" style="width: 500px; min-height: 160px">
          <div class="d-flex text-info flex-grow-1 mr-2 p-2 border rounded">

            <div class="d-flex flex-grow-1 border"
                 v-if="actionName === ACTIONS_SET.SELECT_BADGE">
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
              УДАЛИТЬ
            </div>

            <div v-else-if="actionName === ACTIONS_SET.SELECT_FILE_FORMAT_CSV">
              CSV
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
              <b-button
                  size="sm"
                  class="ml-auto"
                  variant="outline-dark"
                  v-link.close.active="'LEAVE_FEEDBACK_LINK'"
                  v-translate="'LEAVE_FEEDBACK_TITLE'"></b-button>
            </div>
          </div>
        </div>

      </b-overlay>
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
import {
  ACTIONS_DESC,
  ACTIONS_SET,
  GetUserConfigAction,
  SetUserConfigAction,
  StartGenerationAction,
} from '../constants';
import link from '../directives/link';
import translate from '../directives/translate';
import translatePipe from '../filters/translate';
import { sendMessage } from '../libs/lib';
import {
  getLastActiveTab,
  storeLastActiveTab,
} from '../libs/storage';
import PopupActionDescription from './action-description.vue';
import TodayBirthdays from './today-bdays.vue';
import Spinner from './spinner.vue';

const PopupUserSettings = Vue.extend({
  name: 'popup-user-settings',
  filters: {
    translatePipe,
  },
  components: {
    PopupActionDescription,
    'today-birthdays': TodayBirthdays,
    Spinner,
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
  destroyed() {

  },
  created() {
    sendMessage(new GetUserConfigAction(), (message) => {
      this.actionName = message.targetFormat;
    });

    getLastActiveTab()
        .subscribe(tabIndex => this.tabIndex = tabIndex);
  },
  data: () => {
    return {
      ACTIONS_SET,
      ACTIONS_DESC,
      actionName: ACTIONS_SET,
      reminder: true,
      waiting: false,
      tabIndex: 0,
    };
  },
  methods: {
    updateTabIndex(activatedTabId: number) {
      storeLastActiveTab(activatedTabId);
    },
    startGeneration() {
      sendMessage(new StartGenerationAction());
      this.waiting = true;
    },
    updateTarget(val: ACTIONS_SET) {
      sendMessage(new SetUserConfigAction(val));
    },
  },
});

export default PopupUserSettings;
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
