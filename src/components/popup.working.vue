<template>
  <span>
    <p v-translate="'WORKING'"></p>
    <a v-link="'WORKING_LINK'" class="link"><span v-translate="'WORKING_LINK_TITLE'"></span></a>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import link from '../directives/link';
import translate from '../directives/translate';

const PopupWorking = Vue.extend({
  name: 'popup-working',
  directives: {
    translate,
    link,
  },
});

export default PopupWorking;
</script>
