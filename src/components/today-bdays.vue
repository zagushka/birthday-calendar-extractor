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
import { takeUntil } from 'rxjs/operators';
import Vue from 'vue';
import Component from 'vue-class-component';
import link from '../directives/link';
import translate from '../directives/translate';
import { getInfoForBadge } from '../libs/storage/chrome.storage';

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
    getInfoForBadge()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(({birthdays}) => this.users = birthdays);
  }
}
</script>
