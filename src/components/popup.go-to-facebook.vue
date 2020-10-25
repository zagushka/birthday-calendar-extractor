<template>
  <span>
    <p><strong v-translate="'ERROR_HEADER'"></strong></p>
    <p v-translate="'FACEBOOK_REQUIRED'"></p>
    <a v-link.close.active="'FACEBOOK_REQUIRED_LINK'" class="link"><span v-translate="'FACEBOOK_REQUIRED_LINK_TITLE'"></span></a>
  </span>
</template>

<script lang="ts">
  import Vue from 'vue';
  import link from '../directives/link';
  import translate from '../directives/translate';

  const PopupGoToFacebook = Vue.extend({
    name: 'popup-go-to-facebook',
    directives: {
      translate,
      link,
    },
  });

  export default PopupGoToFacebook;
</script>
