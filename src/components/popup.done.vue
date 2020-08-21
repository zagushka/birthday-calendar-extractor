<template>
  <span>
    <p><strong v-translate="'DONE_TITLE'"></strong></p>
    <p v-translate="'DONE_DESCRIPTION'"></p>
    <a v-link="'LEAVE_FEEDBACK_LINK'" class="link special"><span v-translate="'LEAVE_FEEDBACK_TITLE'"></span></a>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import link from '../directives/link';
import translate from '../directives/translate';

const PopupDone = Vue.extend({
  name: 'popup-done',
  directives: {
    translate,
    link,
  },
});

export default PopupDone;
</script>
