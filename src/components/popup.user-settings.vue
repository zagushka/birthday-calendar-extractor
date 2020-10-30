<template>
  <span>
    <span :style.visibility="!waiting ? 'visible': 'hidden'">
      <p><strong v-translate="'USER_SETTINGS'"></strong></p>

      <div class="no-wrap" v-for="action in ACTIONS_SET">
        <input type="radio" :id="action.name" :name="action.name" :value="action.name" v-model="actionName"/>
        <label :for="action.name" v-translate="action.name"></label>
        <span class="do-wrap action-description" v-if="action.name === actionName"
              v-translate="action.description"></span>
      </div>

      <br/>
      <div class="no-wrap">
        <a v-on:click="startGeneration()" class="link"><span v-translate="'GENERATE'"></span></a>
        <a v-link.close.active="'LEAVE_FEEDBACK_LINK'" class="link special"><span
            v-translate="'LEAVE_FEEDBACK_TITLE'"></span></a>
      </div>
    </span>
    <Spinner :show="waiting"></Spinner>
  </span>
</template>

<script lang="ts">

import Vue from 'vue';
import {
  StartGenerationAction,
  GetUserConfigAction,
  SetUserConfigAction,
  ACTIONS_DESC,
  ACTIONS_SET,
} from '../constants';
import link from '../directives/link';
import translate from '../directives/translate';
import { sendMessage } from '../libs/lib';
import PopupActionDescription from './action-description.vue';
import Spinner from './spinner.vue';

const PopupUserSettings = Vue.extend({
  name: 'popup-user-settings',
  components: {
    PopupActionDescription,
    Spinner,
  },
  directives: {
    translate,
    link,
  },
  watch: {
    file_format: (val, oldVal) => {
      if (val === oldVal) {
        return;
      }
      sendMessage(new SetUserConfigAction(val));
    },
  },
  created() {
    sendMessage(new GetUserConfigAction(), (message) => {
      this.actionName = message.targetFormat;
    });
  },
  data: () => {
    return {
      ACTIONS_SET: ACTIONS_DESC,
      actionName: ACTIONS_SET.SELECT_FILE_FORMAT_ICS,
      reminder: true,
      waiting: false,
    };
  },
  methods: {
    startGeneration() {
      sendMessage(new StartGenerationAction());
      this.waiting = true;
    },
  },
});

export default PopupUserSettings;
</script>

<style type="scss">
.no-wrap {
  white-space: nowrap;
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
