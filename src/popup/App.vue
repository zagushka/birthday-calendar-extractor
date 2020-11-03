<template>
  <span>
    <popup-change-language v-if="status === 'NOT_SUPPORTED_LANGUAGE'"></popup-change-language>
    <popup-done v-else-if="status === 'DONE'"></popup-done>
    <popup-user-settings v-else-if="status === 'USER_SETTINGS'"></popup-user-settings>
    <popup-no-token-detected v-else-if="status === 'NO_TOKEN_DETECTED'"></popup-no-token-detected>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PopupChangeLanguage from '../components/popup.change-language.vue';
import PopupDone from '../components/popup.done.vue';
import PopupNoTokenDetected from '../components/popup.no-token.vue';
import PopupUserSettings from '../components/popup.user-settings.vue';
import { ACTION } from '../constants';
import translate from '../directives/translate';
import { setBadgeColor } from '../libs/badge';
import { storeLastBadgeClicked } from '../libs/storage';

@Component({
  components: {
    PopupChangeLanguage,
    PopupDone,
    PopupNoTokenDetected,
    PopupUserSettings,
  },
  directives: {
    translate,
  },
})
export default class App extends Vue {
  public status = 'USER_SETTINGS';

  created() {
    storeLastBadgeClicked();
    setBadgeColor();

    chrome.runtime.onMessage.addListener((message, sender, callback) => {
      if (ACTION.STATUS_REPORT === message.type) {
        this.status = message.status;
      }
    });
  }
}
</script>

<style lang="scss">

</style>
