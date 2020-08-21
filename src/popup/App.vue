<template>
  <popup-go-to-facebook v-if="status === 'FACEBOOK_REQUIRED'"></popup-go-to-facebook>
  <popup-change-language v-else-if="status === 'NOT_SUPPORTED_LANGUAGE'"></popup-change-language>
  <popup-done v-else-if="status === 'DONE'"></popup-done>
  <popup-user-settings v-else-if="status === 'USER_SETTINGS'"></popup-user-settings>
  <popup-no-token-detected v-else-if="status === 'NO_TOKEN_DETECTED'"></popup-no-token-detected>
</template>

<script>

import PopupGoToFacebook from "../components/popup.go-to-facebook";
import PopupChangeLanguage from "../components/popup.change-language";
import PopupDone from "../components/popup.done";
import PopupNoTokenDetected from "../components/popup.no-token";
import PopupUserSettings from "../components/popup.user-settings";
import translate from "../directives/translate";
import {ACTION, CheckStatusAction} from "../constants";
import {sendMessage} from "../libs/lib";

export default {
  components: {
    PopupGoToFacebook,
    PopupChangeLanguage,
    PopupDone,
    PopupNoTokenDetected,
    PopupUserSettings
  },
  directives: {
    translate,
  },
  created() {
    chrome.runtime.onMessage.addListener((message, sender, callback) => {
      if (ACTION.STATUS_REPORT === message.type) {
        this.status = message.status;
      }
    })

    sendMessage(new CheckStatusAction());
  },
  data() {
    return {
      status
    }
  }
}
</script>

<style lang="scss">
p:first-child {
  margin-top: 0;
}

.link {
  box-shadow: inset 0 1px 0 0 #9acc85;
  background: #74ad5a linear-gradient(to bottom, #74ad5a 5%, #68a54b 100%);
  border: 1px solid #3b6e22;
  /*display: inline-block;*/
  white-space: nowrap;
  cursor: pointer;
  color: #ffffff;
  font-size: 13px;
  font-weight: bold;
  padding: 6px 12px;
  text-decoration: none;

}

.link:hover {
  background: #68a54b linear-gradient(to bottom, #68a54b 5%, #74ad5a 100%);
}

.link:active {
  position: relative;
  top: 1px;
}

.link.special {
  box-shadow: inset 0 1px 0 0 #fff;
  color: #333;
  background: #eee linear-gradient(to bottom, #eee 5%, #e4e4e3 100%);
}
.link.special:hover {
  background: #e4e4e3 linear-gradient(to bottom, #e4e4e3 5%, #eee 100%);
}
</style>
