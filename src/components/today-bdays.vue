<template>
  <div class="m-2" style="min-height: 80px">
    <p v-if="!users.length"><strong v-translate="'TODAY_NO_BIRTHDAYS_TITLE'"></strong></p>
    <ul style="list-style-type:none; margin: 0; padding: 0" class="text-nowrap">
      <li v-for="user in users" :key="user.href"><a v-link="user.href">{{ user.name }}</a></li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  BListGroup,
  BListGroupItem,
} from 'bootstrap-vue';
import { DateTime } from 'luxon';
import { Subject } from 'rxjs';
import {
  startWith,
  switchMapTo,
  takeUntil,
} from 'rxjs/operators';
import Vue from 'vue';
import Component from 'vue-class-component';
import { ACTION } from '../constants';
import link from '../directives/link';
import translate from '../directives/translate';
import { listenTo } from '../libs/events/events';
import { getBirthdaysForDate } from '../libs/storage/chrome.storage';

@Component({
  name: 'today-bdays',
  components: {
    BListGroup,
    BListGroupItem,
  },
  directives: {
    link,
    translate,
  },
})
export default class TodayBirthdays extends Vue {
  users: Array<{ name: string; href: string; start: DateTime }> = [];
  onDestroy$: Subject<boolean> = new Subject();

  destroyed() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  mounted() {
    listenTo(ACTION.ALARM_NEW_DAY, ACTION.UPDATE_BADGE) // Update when date changes
        .pipe(
            takeUntil(this.onDestroy$),
            startWith(true), // Display on mount
            switchMapTo(getBirthdaysForDate(DateTime.local())),
        )
        .subscribe(users => this.users = users);
  }
}
</script>
