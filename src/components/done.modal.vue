<template>
  <b-modal
      size="sm"
      centered
      id="DONE"
      :title="'DONE_TITLE' | translatePipe"
  >
    <p v-translate="'DONE_DESCRIPTION'"></p>

    <template #modal-footer="{ok}">
      <leave-feedback-button/>
      <b-button size="sm" variant="success" @click="ok()"> OK</b-button>
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
import LeaveFeedbackButton from './leave-feedback.button.vue';

@Component({
  name: 'done-modal',
  components: {
    LeaveFeedbackButton,
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
export default class DoneModal extends Vue {
  // @TODO ADD DESCRIPTION REGARDING OUTLOOK EVENTS REMOVAL ISSUES
}
</script>
