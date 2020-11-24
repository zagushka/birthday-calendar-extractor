<template>
  <div>
    <!-- Main user interface -->
    <popup-user-settings/>

    <!-- Modal on Success -->
    <done-modal/>

    <!-- Modal on not supported language -->
    <change-language-modal/>

    <!-- Modal on no token detected -->
    <no-token-detected-modal/>
  </div>
</template>

<script lang="ts">

import { Subject } from 'rxjs';
import {
  filter,
  takeUntil,
} from 'rxjs/operators';
import Vue from 'vue';
import Component from 'vue-class-component';
import ChangeLanguageModal from '../components/change-language.modal.vue';
import DoneModal from '../components/done.modal.vue';
import NoTokenDetectedModal from '../components/no-token-detected.modal.vue';
import PopupUserSettings from '../components/popup.user-settings.vue';
import {
  ACTION,

} from '../constants';
import {
  StatusReportAction,
  UpdateBadgeAction,
} from '../libs/events/actions';

import {
  setBadgeColor,
  updateBadge,
} from '../libs/badge';
import {
  listenTo,
  sendMessage,
} from '../libs/events/events';
import { storeLastBadgeClicked } from '../libs/storage/chrome.storage';

const showModalHandler = function (this: App, message: any, sender: chrome.runtime.MessageSender, callback: (response?: any) => void) {
  // Take care of actions with status_report
  if (ACTION.STATUS_REPORT === message.type) {
    this.status = message.status;
    this.showModal(message.status);
  }
};

@Component({
  components: {
    DoneModal,
    NoTokenDetectedModal,
    ChangeLanguageModal,
    PopupUserSettings,
  },
})
export default class App extends Vue {
  public status = 'USER_SETTINGS';
  onDestroy$: Subject<boolean> = new Subject();

  destroyed() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  showModal(status: string) {
    this.$root.$emit('bv::show::modal', status);
  }


  mounted() {
    // Mark badge was clicked now and send event later
    storeLastBadgeClicked()
      .subscribe(() => sendMessage(new UpdateBadgeAction()));

    // Listen to Show modal event on status report
    listenTo<StatusReportAction>(ACTION.STATUS_REPORT)
      .pipe(
        takeUntil(this.onDestroy$),
      )
      .subscribe(({action}) => {
        this.status = action.status;
        this.showModal(action.status);
      });
  }
}
</script>

<style lang="scss">

</style>
