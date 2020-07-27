<template>
  <span>
    <p><strong v-translate="'ERROR_HEADER'"></strong></p>
    <p v-translate="['NOT_SUPPORTED_LANGUAGE', languages]"></p>
    <a v-link="'NOT_SUPPORTED_LANGUAGE_LINK'" class="link"><span
        v-translate="'NOT_SUPPORTED_LANGUAGE_TITLE'"></span></a>
  </span>
</template>

<script lang="ts">
  import Vue from 'vue';
  import link from '../directives/link';
  import translate from '../directives/translate';
  import { getLanguagesList } from '../libs/lib';

  const PopupChangeLanguage = Vue.extend({
    name: 'popup-change-language',
    directives: {
      translate,
      link,
    },
    data() {
      return {
        languages: '<ul><li>' + getLanguagesList().join('<li>') + '</ul>',
      };
    },
  });

  export default PopupChangeLanguage;
</script>
