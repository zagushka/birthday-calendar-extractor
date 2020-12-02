<template>
  <b-button size="sm" variant="outline-dark"
            v-link.close.active="'BUY_ME_COFFEE_LINK'"
            :inner-html.prop="'BUY_ME_COFFEE_TITLE' | translatePipe"></b-button>
</template>

<script lang="ts">
import { BButton } from 'bootstrap-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import link from '../directives/link';
import translateFilter from '../filters/translate';

@Component({
  name: 'buy-coffee-button',
  components: {
    'b-button': BButton,
  },
  directives: {
    link,
  },
  filters: {
    translatePipe: translateFilter,
  },
})
export default class BuyCoffeeButton extends Vue {
}
</script>
