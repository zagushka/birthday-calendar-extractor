<template>
  <b-button
      size="sm"
      class="ml-auto"
      variant="outline-dark"
      v-link.close.active="'LEAVE_FEEDBACK_LINK'"
      v-translate="'LEAVE_FEEDBACK_TITLE'"></b-button>
</template>

<script lang="ts">
import { BButton } from 'bootstrap-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import link from '../directives/link';
import translate from '../directives/translate';

@Component({
  name: 'leave-feedback-button',
  components: {
    'b-button': BButton,
  },
  directives: {
    link,
    translate,
  },
})
export default class LeaveFeedbackButton extends Vue {
}
</script>
