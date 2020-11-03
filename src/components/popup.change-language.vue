<template>
  <span>
    <p><strong v-translate="'ERROR_HEADER'"></strong></p>
    <p v-translate="['NOT_SUPPORTED_LANGUAGE', languages]"></p>
    <a v-link.close.active="'NOT_SUPPORTED_LANGUAGE_LINK'" class="link"><span
        v-translate="'NOT_SUPPORTED_LANGUAGE_TITLE'"></span></a>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import link from '../directives/link';
import translate from '../directives/translate';
import { getLanguagesList } from '../libs/lib';

@Component({
  name: 'popup-change-language',
  directives: {
    translate,
    link,
  },
})
export default class PopupChangeLanguage extends Vue {
  languages = '<ul><li>' + getLanguagesList().join('<li>') + '</ul>';
}
</script>
