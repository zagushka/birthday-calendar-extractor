<template>
  <span>
    <p><strong>Something went wrong</strong></p>
    <p>It happens... Sometime... Please try again later.</p>
    <p>Also you can use the text below to open a bug, I'll do my best to fix it as soon as possible.</p>
    <p><textarea ref="errorArea" :value="message"/></p>
    <button @click="copyToClipboard">Copy text to Clipboard</button>
    <p><a href="#" v-link="'https://github.com/zagushka/birthday-calendar-extractor/issues'">
      Open the bug here.
      </a>
    </p>
    <p>Thank you for making this extension better!</p>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import link from '../directives/link';
import translate from '../directives/translate';

const PopupGeneralError = Vue.extend({
  name: 'popup-no-token-detected',
  props: ['message'],
  directives: {
    translate,
    link,
  },
  methods: {
    copyToClipboard: function () {
      const element = this.$refs.errorArea as HTMLTextAreaElement;
      element.focus();
      element.select();
      document.execCommand('Copy');
      element.blur();
    },
  },
});

export default PopupGeneralError;
</script>

<style lang="scss">
textarea {
  height: 120px;
  width: 100%;
}
</style>
