<template>
  <div class="page new-tool-page">
    <div class="header">
      <router-link
        class="fas fa-times exit-new-tool"
        to="/tools"/>

      <span class="new-tool-text"> New Tool </span>

      <div class="spacer"/>
    </div>

    <transition>
      <div
        v-if="currentState === 1"
        class="new-tool-input-card">
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
    </transition>

    <transition>
      <div
        v-if="currentState === 2"
        class="new-tool-input-card">
        <v-select
          :options="['1', '2', '3']"
          class="dark-input"
          placeholder="Owner"/>

        <v-select
          :options="['1', '2', '3']"
          class="dark-input"
          placeholder="Purchased from"/>

        <!-- <button class="dark-input">
          <span> Purchase Date </span>
        </button> -->

        <v-date-picker
          v-model="selectedDate"
          mode="single"
          show-caps/>

        <button class="dark-input">
          <span> Photo </span>
        </button>

        <input
          class="light-input"
          placeholder="Price">
      </div>
    </transition>

    <transition>
      <div
        v-if="currentState === 3"
        class="new-tool-input-card">

        <extended-fab
          :on-click="() => 0"
          :outline-display="true"
          class="encode-efab"
          icon-class="fa-times"
          button-text="ENOCDE TAG"/>

        <tool-search-result
          :tool="tool"
          :show-select="false"/>

        <div class="done-action-container">
          <extended-fab
            :on-click="() => 0"
            :outline-display="true"
            class="add-another-efab"
            icon-class="fa-undo"
            button-text="ADD ANOTHER"/>

          <extended-fab
            :on-click="() => 0"
            class="done-efab"
            icon-class="fa-arrow-right"
            button-text="DONE"/>
        </div>
      </div>
    </transition>

    <div class="pager-container">
      <fab
        :on-click="() => currentState = --currentState"
        class="page-back"
        icon-class="fa-arrow-left"/>

      <div class="pager">
        <div
          :class="{ selected: currentState === 1 }"
          class="pager-page"/>
        <div
          :class="{ selected: currentState === 2 }"
          class="pager-page"/>
        <div
          :class="{ selected: currentState === 3 }"
          class="pager-page"/>
      </div>

      <fab
        :on-click="() => currentState = ++currentState"
        class="page-forward"
        icon-class="fa-arrow-right"/>
    </div>
  </div>
</template>

<script>
import ToolSearchResult from '../components/tool-search-result.vue'
import ExtendedFab from '../components/extended-fab.vue'
import Fab from '../components/fab'
import vSelect from 'vue-select'

export default {
  name: 'NewTool',
  components: {
    ToolSearchResult,
    ExtendedFab,
    Fab,
    vSelect
  },
  data () {
    return {
      selectedBrand: null,
      currentState: 1,
      selectedDate: new Date(),
      tool: {
        id: '93713',
        type: {
          name: 'Hammer Drill'
        },
        brand: {
          name: 'Bosch'
        },
        status: 'IN_USE',
        user: {
          first_name: 'Colin',
          last_name: 'Pullen'
        }
      }
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

    .pager {
      display: flex;
      justify-content: space-between;
      flex: 0 0 70px;

      .pager-page {
        padding: 0;
        height: 10px;
        width: 10px;
        border-radius: 50%;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        background-color: white;

        &.selected {
          background-color: $renascent-dark-gray;
        }
      }
    }
  }

  .add-another-efab {
    border-color: transparent;
    box-shadow: none;
  }

  .tool-search-result {
    width: 100%;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  }

  .done-action-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
