<template>
  <b-modal
      size="sm"
      centered
      id="NO_TOKEN_DETECTED"
      :title="'ERROR_HEADER' | translatePipe"
  >
    <p v-translate="'NO_TOKEN_DETECTED'"></p>

    <template #modal-footer="{cancel}">
      <b-button
          size="sm"
          class="ml-auto"
          variant="primary"
          v-link.close.active="'LOG_INTO_FACEBOOK_URL'"
          v-translate="'LOG_INTO_FACEBOOK_TITLE'"></b-button>

      <b-button size="sm" @click="cancel()"> Close</b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import {
  BButton,
  BModal,
} from 'bootstrap-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import link from '../directives/link';
import translate from '../directives/translate';
import translateFilter from '../filters/translate';

@Component({
  name: 'no-token-detected-modal',
  components: {
    BModal,
    BButton,
  },
  filters: {
    translatePipe: translateFilter,
  },
  directives: {
    translate,
    link,
  },
})
export default class NoTokenDetectedModal extends Vue {

}
</script>
