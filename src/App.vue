<template>
  <div>
    <table>
      <BirthdayRow v-for="item in calendar" :key="item.href" :item="item"></BirthdayRow>
    </table>
  </div>
</template>

<script lang="ts">
  import BirthdayRow from './components/row.vue';
  import { parseCalendarAndSave } from './libs/lib';

  export default {
    components: {
      'BirthdayRow': BirthdayRow,
    },
    data() {
      return {
        calendar: parseCalendarAndSave(),
      };
    },
  };
</script>

<style lang="scss" scoped>
  .link {
    box-shadow: inset 0 1px 0 0 #9acc85;
    background: #74ad5a linear-gradient(to bottom, #74ad5a 5%, #68a54b 100%);
    border: 1px solid #3b6e22;
    /*display: inline-block;*/
    white-space: nowrap;
    cursor: pointer;
    color: #ffffff;
    font-size: 13px;
    font-weight: bold;
    padding: 6px 12px;
    text-decoration: none;

  }

  .link:hover {
    background: #68a54b linear-gradient(to bottom, #68a54b 5%, #74ad5a 100%);
  }

  .link:active {
    position: relative;
    top: 1px;
  }

</style>
