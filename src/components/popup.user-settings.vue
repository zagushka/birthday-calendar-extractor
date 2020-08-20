<template>
  <span>
    <p><strong v-translate="'USER_SETTINGS'"></strong></p>
    <div class="no-wrap">
      <input type="radio" id="format_ics" name="file_format" value="ics" v-model="file_format">
      <label for="format_ics" v-translate="'SELECT_FILE_FORMAT_ICS'"></label>
    </div>
    <div class="no-wrap">
      <input type="radio" id="format_csv" name="file_format" value="csv" v-model="file_format">
      <label for="format_csv" v-translate="'SELECT_FILE_FORMAT_CSV'"></label>
    </div>
    <div class="no-wrap">
      <input type="radio" id="format_delete-ics" name="file_format" value="delete-ics" v-model="file_format">
      <label for="format_delete-ics" v-translate="'SELECT_FILE_FORMAT_DELETE_ICS'"></label>
    </div>
    <br/>
    <div class="no-wrap">
      <a v-on:click="startGeneration()" class="link"><span v-translate="'GENERATE'"></span></a>
      <a v-link="'LEAVE_FEEDBACK_LINK'" class="link special"><span v-translate="'LEAVE_FEEDBACK_TITLE'"></span></a>
    </div>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  StartGenerationAction,
  GetUserConfigAction,
  SetUserConfigAction,
} from '../constants';
import link from '../directives/link';
import translate from '../directives/translate';
import { sendMessage } from '../libs/lib';

const PopupUserSettings = Vue.extend({
  name: 'popup-user-settings',
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
      this.file_format = message.targetFormat;
    });
  },
  data: () => {
    return {
      file_format: 'ics',
    };
  },
  methods: {
    startGeneration() {
      sendMessage(new StartGenerationAction());
    },
  },
});

export default PopupUserSettings;
</script>

<style>
.no-wrap {
  white-space: nowrap;
}
</style>
