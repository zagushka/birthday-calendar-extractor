<template>
  <popup-go-to-facebook v-if="status === 'FACEBOOK_REQUIRED'"></popup-go-to-facebook>
  <popup-change-language v-else-if="status === 'NOT_SUPPORTED_LANGUAGE'"></popup-change-language>
  <popup-working v-else-if="status === 'WORKING'"></popup-working>
  <popup-no-token-detected v-else-if="status === 'NO_TOKEN_DETECTED'"></popup-no-token-detected>
  <p v-else v-translate="'WORKING'"></p>
</template>

<script>

import PopupGoToFacebook from "../components/popup.go-to-facebook";
import PopupChangeLanguage from "../components/popup.change-language";
import PopupWorking from "../components/popup.working";
import PopupNoTokenDetected from "../components/popup.no-token";
import translate from "../directives/translate";

export default {
  components: {
    PopupGoToFacebook,
    PopupChangeLanguage,
    PopupWorking,
    PopupNoTokenDetected,
  },
  directives: {
    translate,
  },
  created() {
    chrome.runtime.sendMessage({action: 'CHECK_STATUS'}, (message) => {
      this.status = message;
    });
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

</style>
