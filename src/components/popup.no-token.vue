<template>
  <span>
    <p><strong v-translate="'ERROR_HEADER'"></strong></p>
    <p v-translate="'NO_TOKEN_DETECTED'"></p>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import link from '../directives/link';
import translate from '../directives/translate';

@Component({
  name: 'popup-no-token-detected',
  directives: {
    translate,
    link,
  },
})
export default class PopupNoTokenDetected extends Vue {

}
</script>
