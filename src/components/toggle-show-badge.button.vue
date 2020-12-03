<template>
  <div class="flex-grow-1">
    <div v-if="!isActive" class="flex-row">
      Activate in order to see badge with number of birthdays.
      <div>{{ 'ACTIVATE_BADGE_DESCRIPTION' | translatePipe }}</div>
      <div class="d-flex flex-row justify-content-between">
        <b-button size="sm" variant="outline-dark"
                  :inner-html.prop="'ACTIVATE_BADGE_BUTTON_TITLE' | translatePipe"
                  @click="activate()"
        ></b-button>
      </div>
    </div>

    <div v-if="isActive" class="flex-column">
      <div>{{ 'DEACTIVATE_BADGE_DESCRIPTION' | translatePipe }}</div>
      <div class="d-flex flex-row justify-content-between">
        <b-button size="sm" variant="outline-dark"
                  :inner-html.prop="'DEACTIVATE_BADGE_BUTTON_TITLE' | translatePipe"
                  @click="deactivate()"
        />

        <buy-coffee-button/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { BButton } from 'bootstrap-vue';
import { Subject } from 'rxjs';
import {
  pluck,
  startWith,
  switchMapTo,
  takeUntil,
} from 'rxjs/operators';
import Vue from 'vue';
import Component from 'vue-class-component';
import {
  ACTION,
  ACTIONS_SET,
  STORAGE_KEYS,
} from '../constants';
import translateFilter from '../filters/translate';
import { StartGenerationAction } from '../libs/events/actions';
import {
  listenTo,
  sendMessage,
} from '../libs/events/events';
import { retrieveUserSettings } from '../libs/storage/chrome.storage';
import BuyCoffeeButton from './buy-coffee.button.js';

@Component({
  name: 'toggle-show-badge-button',
  components: {
    BuyCoffeeButton,
    BButton,
  },
  filters: {
    translatePipe: translateFilter,
  },
})
export default class ToggleShowBadgeButton extends Vue {

  isActive: boolean = false;
  onDestroy$: Subject<any> = new Subject();

  deactivate() {
    this.$emit('set-waiting', true);
    sendMessage(new StartGenerationAction(ACTIONS_SET.DISABLE_BADGE))
        .subscribe(() => {
          this.$emit('set-waiting', false);
        });
  }

  activate() {
    this.$emit('set-waiting', true);
    sendMessage(new StartGenerationAction(ACTIONS_SET.ENABLE_BADGE))
        .subscribe(() => {
          this.$emit('set-waiting', false);
        });
  }

  destroyed() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  mounted() {
    // Load current status and listen to updates
    listenTo(ACTION.UPDATE_BADGE)
        .pipe(
            takeUntil(this.onDestroy$),
            startWith(true),
            switchMapTo(retrieveUserSettings([STORAGE_KEYS.BADGE_ACTIVE])),
            pluck(STORAGE_KEYS.BADGE_ACTIVE),
        )
        .subscribe(isActive => {
          this.isActive = isActive;
        });
  }
}
</script>
