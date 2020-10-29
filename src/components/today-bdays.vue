<template>
  <span>
    <p><strong v-translate="'TODAY_BIRTHDAY_TITLE'"></strong></p>
    <ul>
      <li v-for="user in users" :key="user.href"><a v-link="user.href">{{ user.name }}</a></li>
    </ul>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import link from '../directives/link';
import translate from '../directives/translate';
import { RawEvent } from '../libs/lib';
import { getInfoForBadge } from '../libs/storage';

const TodayBirthdays = Vue.extend({
  name: 'today-bdays',
  directives: {
    link,
    translate,
  },
  created() {
    getInfoForBadge()
        .subscribe(({birthdays}) => this.users = birthdays);
  },
  data() {
    const users: Array<RawEvent> = [];
    return {
      users,
    };
  },
});

export default TodayBirthdays;
</script>
