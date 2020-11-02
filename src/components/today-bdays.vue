<template>
  <span>
    <p v-if="!users.length"><strong v-translate="'TODAY_NO_BIRTHDAYS_TITLE'"></strong></p>
    <ul style="list-style-type:none;">
      <li v-for="user in users" :key="user.href"><a v-link="user.href">{{ user.name }}</a></li>
    </ul>
  </span>
</template>

<script lang="ts">
import {
  BListGroup,
  BListGroupItem,
} from 'bootstrap-vue';
import Vue from 'vue';
import link from '../directives/link';
import translate from '../directives/translate';
import { RawEvent } from '../libs/lib';
import { getInfoForBadge } from '../libs/storage';

const TodayBirthdays = Vue.extend({
  name: 'today-bdays',
  components: {
    'b-list-group': BListGroup,
    'b-list-group-item': BListGroupItem,
  },
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
