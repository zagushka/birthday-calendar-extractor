<template>
  <b-list-group>
    <b-list-group-item @click="clearChromeStorage">Clear Chrome Local Storage</b-list-group-item>
  </b-list-group>
</template>

<script lang="ts">
import {
  BButton,
  BListGroup,
  BListGroupItem,
} from 'bootstrap-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { clearStorage } from '../libs/storage/chrome.storage';

@Component({
  name: 'toolz',
  components: {
    BListGroup,
    BListGroupItem,
    BButton,
  },
})
export default class ToolzComponent extends Vue {
  clearChromeStorage(){
    clearStorage();
  }
}
</script>
