<template>
  <div>
    <div v-if="ACTIONS.ENABLE_BADGE === action">
      <span v-translate="'SELECT_ICS_DESCRIPTION'"></span>
    </div>
    <div v-else-if="ACTIONS.SELECT_FILE_FORMAT_CSV === action">ICS</div>
    <div v-else-if="ACTIONS.SELECT_FILE_FORMAT_DELETE_ICS === action">ICS</div>
    <div v-else-if="ACTIONS.SELECT_FILE_FORMAT_CSV === action">ICS</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {
  ACTIONS_SET,
} from '../../constants';
import handleLink from '../filters/handleLInks';
import translate from '../directives/translate';

@Component({
  name: 'popup-action-description',
  props: {
    action: null,
  },
  directives: {
    translate,
    link: handleLInks,
  },
})
export default class ActionDescription extends Vue {
  ACTIONS = ACTIONS_SET
};

</script>
