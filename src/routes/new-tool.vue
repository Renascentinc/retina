<template>
  <div class="page new-tool-page">
    <div class="header">
      <i class="fas fa-times exit-new-tool"/>

      <span class="new-tool-text"> New Tool </span>

      <div class="spacer"/>
    </div>

    <div class="new-tool-input-card">
      <v-select
        :options="['1', '2', '3']"
        class="dark-input"
        placeholder="Brand"/>

      <v-select
        :options="['1', '2', '3']"
        class="dark-input"
        placeholder="Type"/>

      <input
        class="light-input"
        placeholder="Model no.">

      <input
        class="light-input"
        placeholder="Serial no.">

      <input
        class="light-input"
        placeholder="Model Year">
    </div>

    <div class="pager-container">
      <fab
        :on-click="() => 0"
        class="page-back"
        icon-class="fa-arrow-left"/>

      <fab
        :on-click="() => 0"
        class="page-forward"
        icon-class="fa-arrow-right"/>
    </div>
  </div>
</template>

<script>
import Fab from '../components/fab'
import vSelect from 'vue-select'

export default {
  name: 'NewTool',
  components: {
    Fab,
    vSelect
  },
  data () {
    return {
      selectedBrand: null
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.new-tool-page {
  display: flex;
  flex-direction: column;
  background-color: $background-light-gray;

  .header {
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 0 0 73px;
    border-bottom-right-radius: 7px;
    border-bottom-left-radius: 7px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.16);
    padding: 0 20px;

    .exit-new-tool {
      font-size: 30px;
      color: $renascent-red;
      width: 21px;
    }

    .new-tool-text {
      font-size: 33px;
      font-weight: 900;
    }

    .spacer {
      width: 21px;
    }
  }

  .new-tool-input-card {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    margin: 10px 10px 0 10px;
    background-color: white;
    align-items: center;
    justify-content: space-around;
    padding: 0 20px;

    .dropdown {
      width: 100%;
    }
  }

  .pager-container {
    display: flex;
    flex: 0 0 90px;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
