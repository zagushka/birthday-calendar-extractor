<template>
  <div>
    <!-- Main user interface -->
    <popup-user-settings/>

    <!-- Modal on Success -->
    <done-modal/>

    <!-- Modal on not supported language -->
    <change-language-modal/>

    <!-- Modal on no token detected -->
    <no-token-detected-modal/>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import Component from 'vue-class-component';
import ChangeLanguageModal from '../components/change-language.modal.vue';
import DoneModal from '../components/done.modal.vue';
import NoTokenDetectedModal from '../components/no-token-detected.modal.vue';
import PopupUserSettings from '../components/popup.user-settings.vue';
import { ACTION } from '../constants';

import { setBadgeColor } from '../libs/badge';
import { storeLastBadgeClicked } from '../libs/storage/chrome.storage';

const messageHandler = function (this: App, message: any, sender: chrome.runtime.MessageSender, callback: (response?: any) => void) {
  if (ACTION.STATUS_REPORT === message.type) {
    this.status = message.status;
    this.showModal(message.status);
  }
};

@Component({
  components: {
    DoneModal,
    NoTokenDetectedModal,
    ChangeLanguageModal,
    PopupUserSettings,
  },
})
export default class App extends Vue {
  public status = 'USER_SETTINGS';

  showModal(status: string) {
    this.$root.$emit('bv::show::modal', status);
  }

  mounted() {
    storeLastBadgeClicked();
    setBadgeColor();

    chrome.runtime.onMessage.addListener(messageHandler.bind(this));
  }
}
</script>

<style lang="scss">

</style>
