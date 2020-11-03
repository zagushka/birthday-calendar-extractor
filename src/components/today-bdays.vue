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
import Vue from 'vue';
import Component from 'vue-class-component';
import link from '../directives/link';
import translate from '../directives/translate';
import { RawEvent } from '../libs/lib';
import { getInfoForBadge } from '../libs/storage';

@Component({
  name: 'today-bdays',
  components: {
    'b-list-group': BListGroup,
    'b-list-group-item': BListGroupItem,
  },
  directives: {
    link,
    translate,
  },
})
export default class TodayBirthdays extends Vue {
  users: Array<RawEvent> = [];

  created() {
    getInfoForBadge()
        .subscribe(({birthdays}) => this.users = birthdays);
  }
}
</script>
