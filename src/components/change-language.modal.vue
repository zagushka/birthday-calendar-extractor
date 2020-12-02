<template>
  <b-modal
      size="sm"
      centered
      id="NOT_SUPPORTED_LANGUAGE"
      :title="'NOT_SUPPORTED_LANGUAGE_TITLE' | translatePipe"
  >
    <p v-translate="['NOT_SUPPORTED_LANGUAGE', languages]"></p>

    <template #modal-footer="{cancel}">
      <b-button
          size="sm"
          class="ml-auto"
          variant="success"
          v-link.close.active="'CHANGE_FACEBOOK_LANGUAGE_LINK'"
          v-translate="'CHANGE_FACEBOOK_LANGUAGE_LINK_TITLE'"></b-button>

      <b-button size="sm" @click="cancel()"> Close</b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import {
  BButton,
  BModal,
  BBadge,
} from 'bootstrap-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import link from '../directives/link';
import translate from '../directives/translate';
import translateFilter from '../filters/translate';
import { getLanguagesList } from '../libs/lib';

@Component({
  name: 'change-language-modal',
  components: {
    BModal,
    BButton,
    BBadge,
  },
  filters: {
    translatePipe: translateFilter,
  },
  directives: {
    translate,
    link,
  },
})
export default class ChangeLanguageModal extends Vue {
  languages = getLanguagesList().map(e => `<span class="badge badge-info">${e}</span>`).join(' ');
}
</script>
