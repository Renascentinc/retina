<template>
  <div class="page tools-page">
    <div class="search-bar">
      <tool-search-input :update-tags="updateFilters"/>
    </div>
    <div class="tool-scroll-container">
      <transition>
        <div
          v-if="$apollo.queries.searchTool.loading"
          class="loading-container">
          <div class="loading"/>
        </div>
      </transition>
      <transition>
        <div
          v-if="!$apollo.queries.searchTool.loading && !tools.length"
          class="no-tools-container">
          <span class="no-tools-text">No Tools To Display</span>
        </div>
      </transition>

      <transition-group
        name="list"
        tag="div">
        <tool-search-result
          v-for="tool in tools"
          :tool="tool"
          :key="tool.id"
          :on-select="transitionToToolInfo"
          :show-select="currentState !== states.INITIAL"/>
      </transition-group>
    </div>

    <transition>
      <div
        v-if="currentState === states.INITIAL"
        class="floating-action-bar">
        <extended-fab
          :on-click="onTransferClick"
          class="transfer-btn"
          icon-class="fa-exchange-alt"
          button-text="TRANSFER"/>

        <fab
          :on-click="transitionToAdd"
          class="add-btn"
          icon-class="fa-plus"/>
      </div>
    </transition>

    <transition>
      <div
        v-if="currentState === states.SELECTING"
        class="nav-bar selection-action-bar">
        <div class="icon-text-container">
          <button
            class="fas fa-times menu-icon"
            @click="cancelTransfer">
            <span class="icon-subtext">CANCEL</span>
          </button>
        </div>
        <div class="icon-text-container">
          <button
            :class="{ 'fa-check-square': !showOnlySelectedTools, 'fa-square': showOnlySelectedTools }"
            class="fas menu-icon"
            @click="toggleViewSelected">
            <span class="icon-subtext">{{ showOnlySelectedTools ? 'VIEW ALL' : 'VIEW SELECTED' }}</span>
          </button>
        </div>
        <div class="icon-text-container">
          <button
            class="fas fa-arrow-right menu-icon"
            @click="proceedToFinalize">
            <span class="icon-subtext">NEXT</span>
          </button>
        </div>
      </div>
    </transition>

    <transition>
      <div
        v-if="currentState === states.FINALIZING"
        class="finalizing-action-bar">
        <div class="finalize-row finalize-header">
          <span> Transfer {{ formattedNumSelectedTools }} </span>
        </div>

        <div class="finalize-row finalize-middle">
          <span class="finalize-to-text"> To </span>
          <select
            class="dark-dropdown"
            placeholder="select user">
            <option> select user </option>
            <option
              v-for="user in users"
              :key="user.id">
              {{ `${user.first_name} ${user.last_name}` }}
            </option>
          </select>
        </div>

        <div class="finalize-row finalize-footer">
          <extended-fab
            :on-click="cancelTransfer"
            :outline-display="true"
            class="cancel-efab"
            icon-class="fa-times"
            button-text="CANCEL"/>

          <extended-fab
            :on-click="finalizeTransfer"
            class="finish-transfer"
            icon-class="fa-arrow-right"
            button-text="FINISH"/>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ToolSearchInput from '../components/tool-search-input.vue'
import ToolSearchResult from '../components/tool-search-result.vue'
import ExtendedFab from '../components/extended-fab.vue'
import Fab from '../components/fab.vue'
import gql from 'graphql-tag'

export default {
  name: 'Tools',

  components: {
    ToolSearchInput,
    ToolSearchResult,
    ExtendedFab,
    Fab
  },

  apollo: {
    getAllUser: gql`query {
      getAllUser {
        id
        first_name
        last_name
        role
      }
    }`,

    searchTool: {
      query: gql`query tools($query: String, $toolFilter: ToolFilter, $pagingParameters: PagingParameters) {
        searchTool(query: $query, toolFilter: $toolFilter, pagingParameters: $pagingParameters) {
          id
          type {
            name
          }
          brand {
            name
          }
          status
          user {
            first_name
            last_name
          }
          location {
            name
          }
        }
      }`,

      variables () {
        let options = {
          pagingParameters: {
            page_number: this.pageNumber,
            page_size: this.pageSize
          }
        }

        if (this.searchString) {
          options.query = this.searchString
        }

        if (this.filters) {
          options.toolFilter = this.filters
        }

        return options
      }
    }
  },

  data () {
    let states = {
      INITIAL: 'INITIAL',
      SELECTING: 'SELECTING',
      FINALIZING: 'FINALIZING'
    }

    let currentState = states.INITIAL

    return {
      filterMap: {
        BRAND: 'brand_ids',
        USER: 'user_ids',
        TYPE: 'type_ids',
        STATUS: 'tool_statuses'
      },
      searchTool: [],
      pageNumber: 0,
      pageSize: 25,
      searchString: null,
      filters: null,
      showOnlySelectedTools: false,
      currentState,
      states
    }
  },

  computed: {
    tools () {
      let tools = this.searchTool || []
      if (this.showOnlySelectedTools) {
        return tools.filter(tool => this.$store.state.selectedToolsMap[tool.id])
      }
      return tools
    },

    users () {
      return this.getAllUser || []
    },

    numSelectedTools () {
      return this.$store.getters.selectedTools.length
    },

    formattedNumSelectedTools () {
      return `${this.numSelectedTools} ${this.numSelectedTools === 1 ? 'tool' : 'tools'}`
    }
  },

  created () {
    if (this.numSelectedTools.length) {
      this.currentState = this.states.SELECTING
    }
  },

  methods: {
    transitionToToolInfo (toolId) {
      this.$router.push({ name: 'toolDetail', params: { toolId } })
    },

    transitionToAdd () {
      this.$router.push({ name: 'newTool' })
    },

    updateFilters (filters = [], fuzzySearch) {
      this.searchString = fuzzySearch

      let newFilters = filters.length ? {} : null
      filters.forEach(filter => {
        let key = this.filterMap[filter.type]

        if (!newFilters[key]) {
          newFilters[key] = [filter.id]
        } else {
          newFilters[key].push(filter.id)
        }
      })
      this.filters = newFilters
    },

    onTransferClick () {
      this.currentState = this.states.SELECTING
    },

    cancelTransfer () {
      this.$store.commit('resetSelectedTools')
      this.currentState = this.states.INITIAL
    },

    toggleViewSelected () {
      this.showOnlySelectedTools = !this.showOnlySelectedTools
    },

    finalizeTransfer () {
      // TODO make api call to transfer tools
      this.$store.commit('resetSelectedTools')
      this.currentState = this.states.INITIAL
    },

    proceedToFinalize () {
      this.currentState = this.states.FINALIZING
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.tools-page {
  display: flex;
  flex-direction: column;

  .search-bar {
    padding: 10px;
    min-height: 45px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    z-index: 5;
    display: flex;
  }

  .tool-scroll-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: $background-light-gray;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-top: 5px;
  }

  .no-tools-container {
    display: flex;
    justify-content: center;
    padding-top: 50px;
  }

  .floating-action-bar {
    display: inline-block;
    position: absolute;
    bottom: 75px;
    width: 100vw;
    height: 57px;
    vertical-align: bottom;

    .transfer-btn {
      position: absolute;
      left: calc(50% - 79px);
      width: 158px;
      bottom: 3.5px;
    }

    .add-btn {
      position: absolute;
      right: 20px;
    }
  }

  .loading-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: absolute;
    top: 100px;
    left: 0;
    width: 100vw;
  }

  .selection-action-bar {
    position: absolute;
    bottom: 0;
    width: calc(100vw - 40px);
    height: 60px;
    background-color: white;
    z-index: 100;
    box-shadow: none;
    display: flex;
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 20px;

    .icon-text-container {
      width: 95px;
      flex: 0 0 95px;

      .menu-icon {
        color: $renascent-red;

        .icon-subtext {
          color: $renascent-dark-gray;
        }
      }
    }
  }

  .finalizing-action-bar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    bottom: 0;
    width: 100vw;
    height: 256px;
    background-color: white;
    z-index: 100;
    box-shadow: 0 0 10px #777;

    .finalize-row {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 43px;
      font-weight: 900;
    }

    .finalize-middle {
      height: 100px;
      align-items: flex-start;
      padding-top: 20px;

      span {
        font-size: 39px;
        margin-right: 13px;
      }
    }

    .finalize-header {
      font-size: 43px;
      font-weight: 900;
    }

    .finalize-footer {
      justify-content: space-evenly;
    }

    .extended-fab {
      width: 146px;
    }
  }
}

.dark-dropdown {
  width: 243px;
  height: 45px;
  background-color: $renascent-dark-gray;
  border-radius: 3px;
  color: white;
  // font-size: 31px;
  font-family: Lato;
  font-weight: 700;
  padding-left: 7px;
  padding-bottom: 5px;
  font-size: 28px;
}
</style>
