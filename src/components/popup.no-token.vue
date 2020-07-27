<template>
  <span>
    <p><strong v-translate="'ERROR_HEADER'"></strong></p>
    <p v-translate="'NO_TOKEN_DETECTED'"></p>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import link from '../directives/link';
import translate from '../directives/translate';

const PopupNoTokenDetected = Vue.extend({
  name: 'popup-no-token-detected',
  directives: {
    translate,
    link,
  },
});

export default PopupNoTokenDetected;
</script>
