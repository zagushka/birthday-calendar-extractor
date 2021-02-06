<template>
  <span>
    <span :style.visibility="!waiting ? 'visible': 'hidden'">
      <p><strong v-translate="'USER_SETTINGS'"></strong></p>
      <div class="no-wrap">
        <input type="radio" id="format_ics" name="file_format" value="ics" v-model="file_format">
        <label for="format_ics" v-translate="'SELECT_FILE_FORMAT_ICS'"></label>
      </div>
      <div class="no-wrap">
        <input type="radio" id="format_delete-ics" name="file_format" value="delete-ics" v-model="file_format">
        <label for="format_delete-ics" v-translate="'SELECT_FILE_FORMAT_DELETE_ICS'"></label>
      </div>
      <div class="no-wrap">
        <input type="radio" id="format_csv" name="file_format" value="csv" v-model="file_format">
        <label for="format_csv" v-translate="'SELECT_FILE_FORMAT_CSV'"></label>
      </div>
      <br/>
      <div class="no-wrap" style="display: flex; justify-content: space-between;">
        <a v-on:click="startGeneration()" class="link"><span v-translate="'GENERATE'"></span></a>
        <a v-link="'https://github.com/zagushka/birthday-calendar-extractor/issues'"
           class="link special"><span>🐞</span></a>
      </div>

      <hr/>

      <p v-translate="'BEFORE_SHARE_LINKS'"></p>
      <div style="display: flex; flex-direction: column;">
        <a v-link="'LEAVE_FEEDBACK_LINK'" class="link special"><span v-translate="'LEAVE_FEEDBACK_TITLE'"></span></a>
        <a v-link="'BUY_ME_COFFEE_LINK'" class="link"><span v-translate="'BUY_ME_COFFEE_TITLE'"></span></a>
      </div>



    </span>
    <div id="spinner-container" v-show="waiting">
      <div class="spinner">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
      {{ status }}
    </div>

  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  StartGenerationAction,
  GetUserConfigAction,
  SetUserConfigAction,
  ACTION,
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
    chrome.runtime.onMessage.addListener((message, sender, callback) => {
      if (ACTION.GENERATION_FLOW_STATUS === message.type) {
        switch (message.status) {
          case 'next':
            this.status = message.message;
            break;
          case 'complete':
            this.status = '';
            break;
          case 'error':
            this.status = 'message.message';
            break;
        }
      }
    });

    sendMessage(new GetUserConfigAction(), (message) => {
      this.file_format = message.targetFormat;
    });
  },
  data: () => {
    return {
      file_format: 'ics',
      waiting: false,
      status: '',
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

#spinner-container {
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000;
  text-align: center;
}

/** https://github.com/tobiasahlin/SpinKit **/
.spinner {
  margin: calc(50vh - 40px) auto;
  width: 50px;
  height: 40px;
  text-align: center;
  font-size: 10px;
}

.spinner > div {
  background-color: #3b6e22;
  height: 100%;
  width: 6px;
  display: inline-block;

  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes sk-stretchdelay {
  0%, 40%, 100% {
    -webkit-transform: scaleY(0.4)
  }
  20% {
    -webkit-transform: scaleY(1.0)
  }
}

@keyframes sk-stretchdelay {
  0%, 40%, 100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
}

</style>
