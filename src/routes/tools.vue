<template>
  <div class="page tools-page">
    <div class="search-bar">
      <tool-search-input :update-tags="updateFilters"></tool-search-input>
      <nfc-scan :on-scan="onScan"></nfc-scan>
    </div>
    <div
      v-if="transferInProgress"
      class="overlay">
      <div class="half-circle-spinner">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
      </div>
    </div>
    <extended-fab
      v-if="$mq === 'mobile' && currentState === states.INITIAL"
      :on-click="onTransferClick"
      class="transfer-btn"
      icon-class="fa-exchange-alt"
      button-text="TRANSFER">
    </extended-fab>
    <div
      v-infinite-scroll="loadMore"
      ref="scrollElement"
      :infinite-scroll-immediate-check="false"
      :infinite-scroll-throttle-delay="200"
      class="tools-menu-container">
      <div
        class="floating-action-bar">
        <extended-fab
          v-if="$mq === 'desktop' && currentState === states.INITIAL"
          :on-click="onTransferClick"
          class="transfer-btn"
          icon-class="fa-exchange-alt"
          button-text="TRANSFER">
        </extended-fab>

        <extended-fab
          v-if="$mq === 'desktop' && currentState === states.SELECTING"
          :on-click="cancelTransfer"
          class="cancel-fab-btn"
          icon-class="fa-times"
          button-text="CANCEL">
        </extended-fab>

        <extended-fab
          v-if="$mq === 'desktop' && currentState === states.SELECTING"
          :on-click="toggleViewSelected"
          :icon-class="showOnlySelectedTools ? 'fa-check-square' : 'fa-list'"
          :button-text="showOnlySelectedTools ? 'VIEW ALL' : 'VIEW SELECTED'"
          class="view-fab-btn">
        </extended-fab>

        <extended-fab
          v-if="$mq === 'desktop' && currentState === states.SELECTING"
          :on-click="proceedToFinalize"
          class="view-fab-btn"
          icon-class="fa-arrow-right"
          button-text="NEXT">
        </extended-fab>

        <extended-fab
          v-if="$mq === 'desktop' && currentState === states.INITIAL"
          :on-click="transitionToAdd"
          class="add-btn"
          icon-class="fa-plus"
          button-text="ADD TOOL">
        </extended-fab>

        <extended-fab
          v-if="$mq === 'desktop' && currentState === states.FINALIZING"
          :on-click="cancelTransfer"
          class="cancel-efab"
          icon-class="fa-times"
          button-text="CANCEL">
        </extended-fab>

        <v-select
          v-if="$mq === 'desktop' && currentState === states.FINALIZING"
          :options="transferTargets"
          :filterable="false"
          v-model="transferTarget"
          class="dark-input">
        </v-select>

        <extended-fab
          v-if="$mq === 'desktop' && currentState === states.FINALIZING"
          :on-click="finalizeTransfer"
          :disabled="!transferTarget.id || numSelectedTools === 0"
          class="finish-transfer"
          icon-class="fa-arrow-right"
          button-text="FINISH">
        </extended-fab>
      </div>
      <div class="tool-scroll-container">
        <add-button
          v-if="$mq === 'mobile'"
          :key="0"
          :on-click="transitionToAdd"
          text="TOOL">
        </add-button>

        <transition name="list-loading">
          <div
            v-if="$apollo.queries.searchTool.loading"
            class="loading-container">
            <div class="half-circle-spinner">
              <div class="circle circle-1"></div>
              <div class="circle circle-2"></div>
            </div>
          </div>
        </transition>

        <transition name="fade">
          <div
            v-if="!$apollo.queries.searchTool.loading && !tools.length"
            class="no-tools-container">
            <span class="no-tools-text">No Tools To Display</span>
          </div>
        </transition>

        <transition-group
          name="list-element"
          tag="span">
          <tool-search-result
            v-for="tool in tools"
            :tool="tool"
            :key="tool.id"
            :on-select="transitionToToolInfo"
            :show-select="currentState !== states.INITIAL">
          </tool-search-result>
        </transition-group>

        <transition name="list-loading">
          <div
            v-if="$apollo.queries.searchTool.loading && paginationLoading"
            class="loading-container">
            <div class="half-circle-spinner">
              <div class="circle circle-1"></div>
              <div class="circle circle-2"></div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="$mq === 'mobile' && currentState === states.SELECTING"
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
            :class="{ 'fa-check-square': !showOnlySelectedTools, 'fa-list': showOnlySelectedTools }"
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

    <transition name="fade">
      <div
        v-if="$mq === 'mobile' && currentState === states.FINALIZING"
        class="finalizing-action-bar">
        <div class="finalize-row finalize-header">
          <span> Transfer {{ formattedNumSelectedTools }} </span>
        </div>

        <div class="finalize-row finalize-middle">
          <span class="finalize-to-text"> To </span>
          <v-select
            :options="transferTargets"
            :searchable="false"
            v-model="transferTarget"
            class="dark-input">
          </v-select>
        </div>

        <div class="finalize-row finalize-footer">
          <extended-fab
            :on-click="cancelTransfer"
            :outline-display="true"
            class="cancel-efab"
            icon-class="fa-times"
            button-text="CANCEL">
          </extended-fab>

          <extended-fab
            :on-click="finalizeTransfer"
            :disabled="!transferTarget.id || numSelectedTools === 0"
            class="finish-transfer"
            icon-class="fa-arrow-right"
            button-text="FINISH">
          </extended-fab>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import swal from 'sweetalert2'
import ToolSearchInput from '../components/tool-search-input'
import ToolSearchResult from '../components/tool-search-result'
import ExtendedFab from '../components/extended-fab'
import NfcScan from '../components/nfc-scan'
import AddButton from '../components/add-button'
import vSelect from '../components/select'
import gql from 'graphql-tag'
import Roles from '../utils/roles'

export default {
  name: 'Tools',

  components: {
    ToolSearchInput,
    ToolSearchResult,
    ExtendedFab,
    vSelect,
    NfcScan,
    AddButton
  },

  apollo: {
    getAllLocation: gql`query {
      getAllLocation {
        id
        name
        type
      }
    }`,

    getAllUser: gql`query {
      getAllUser {
        id
        first_name
        last_name
        role
        type
        status
      }
    }`,

    searchTool: {
      query: gql`query tools($query: String, $toolFilter: ToolFilter, $pagingParameters: PagingParameters) {
        searchTool(query: $query, toolFilter: $toolFilter, pagingParameters: $pagingParameters) {
          id
          type {
            id
            name
          }
          brand {
            id
            name
          }
          status
          owner {
            ... on Location {
               id
               name
               type
            }
            ... on User {
               id
               first_name
               last_name
               type
            }
          }
        }
      }`,

      variables () {
        let options = {
          pagingParameters: {
            page_size: this.pageSize,
            page_number: this.pageNumber
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
        USER: 'owner_ids',
        LOCATION: 'owner_ids',
        TYPE: 'type_ids',
        STATUS: 'tool_statuses'
      },
      transferTarget: { id: null, label: 'select user' },
      searchTool: [],
      pageNumber: 0,
      infiniteScrollPageNumber: 0,
      pageSize: 15,
      searchString: null,
      filters: null,
      showOnlySelectedTools: false,
      paginationLoading: false,
      transferInProgress: false,
      currentState,
      states
    }
  },

  computed: {
    tools () {
      let tools = this.searchTool || []

      if (this.currentState === this.states.SELECTING && JSON.parse(window.localStorage.getItem('currentUser')).role !== Roles.ADMIN) {
        tools = tools.filter(tool => (tool.owner.type === 'LOCATION' && tool.status === 'AVAILABLE') || tool.owner.id === JSON.parse(window.localStorage.getItem('currentUser')).id)
      }

      if (this.showOnlySelectedTools) {
        return tools.filter(tool => this.$store.state.selectedToolsMap[tool.id])
      }
      return tools
    },

    transferTargets () {
      return this.users.concat(this.locations)
    },

    users () {
      if (this.getAllUser) {
        this.getAllUser.forEach(user => {
          user.label = `${user.first_name} ${user.last_name}`
        })
      }
      return this.getAllUser || []
    },

    locations () {
      if (this.getAllLocation) {
        this.getAllLocation.forEach(location => {
          location.label = location.name
        })
      }
      return this.getAllLocation || []
    },

    numSelectedTools () {
      return this.$store.getters.selectedTools.length
    },

    formattedNumSelectedTools () {
      return `${this.numSelectedTools} ${this.numSelectedTools === 1 ? 'tool' : 'tools'}`
    }
  },

  created () {
    if (this.numSelectedTools !== 0) {
      this.currentState = this.states.SELECTING
    }
  },

  methods: {
    showTransferSuccessMsg () {
      swal({
        type: 'success',
        title: 'TRANSFER SUCCESS',
        text: 'Successfully Transferred Tools'
      })
    },

    showTransferErrorMsg () {
      swal({
        type: 'error',
        title: 'TRANSFER ERROR',
        text: 'Error Transferring Tools. Please Try Again or Contact Support'
      })
    },

    resetInfiniteScroll () {
      this.infiniteScrollPageNumber = parseInt(this.tools.length / this.pageSize)
      this.hasLoadedLastPage = false
      this.resetScrollPosition()
    },

    resetScrollPosition () {
      this.$refs.scrollElement.scrollTo(0, 0)
    },

    onScan (value) {
      if (this.currentState === this.states.INITIAL) {
        this.transitionToToolInfo(value)
      } else {
        this.$store.commit('toggleToolSelection', value)
      }
    },

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
      this.resetInfiniteScroll()
    },

    onTransferClick () {
      this.currentState = this.states.SELECTING
    },

    cancelTransfer () {
      this.$store.commit('resetSelectedTools')
      this.showOnlySelectedTools = false
      this.currentState = this.states.INITIAL
      this.resetScrollPosition()
    },

    toggleViewSelected () {
      this.showOnlySelectedTools = !this.showOnlySelectedTools
      this.resetScrollPosition()
    },

    loadMore () {
      if (this.hasLoadedLastPage || !this.tools.length || this.$apollo.queries.searchTool.loading || this.showOnlySelectedTools) {
        return
      }

      this.paginationLoading = true
      this.infiniteScrollPageNumber++

      let options = {
        pagingParameters: {
          page_size: this.pageSize,
          page_number: this.infiniteScrollPageNumber
        }
      }

      if (this.searchString) {
        options.query = this.searchString
      }

      if (this.filters) {
        options.toolFilter = this.filters
      }

      this.$apollo.queries.searchTool.fetchMore({
        variables: options,

        updateQuery: (previousResult, { fetchMoreResult }) => {
          this.hasLoadedLastPage = !fetchMoreResult.searchTool.length
          return {
            searchTool: [...previousResult.searchTool, ...fetchMoreResult.searchTool]
          }
        }
      }).then(() => {
        this.paginationLoading = false
      })
    },

    finalizeTransfer () {
      this.transferInProgress = true
      this.$apollo.mutate({
        mutation: gql`mutation transferTools($tool_id_list: [ID!]!, $to_owner_id: ID!) {
          transferMultipleTool (tool_id_list: $tool_id_list, to_owner_id: $to_owner_id) {
            id
            type {
              id
              name
            }
            brand {
              id
              name
            }
            status
            owner {
              ... on Location {
                 id
                 name
                 type
              }
              ... on User {
                 id
                 first_name
                 last_name
                 type
              }
            }
          }
        }`,
        variables: {
          tool_id_list: this.$store.getters.selectedTools,
          to_owner_id: this.transferTarget.id
        }
      }).then(response => {
        this.resetScrollPosition()
        response.data.transferMultipleTool.forEach(tool => {
          let idx = this.searchTool.findIndex(entry => entry.id === tool.id)
          this.searchTool[idx] = tool
        })
        this.$store.commit('resetSelectedTools')
        this.showOnlySelectedTools = false
        this.currentState = this.states.INITIAL
        this.showTransferSuccessMsg()
        this.$apollo.queries.searchTool.refresh()
      }).catch(() => {
        this.showTrasnferErrorMsg()
      }).finally(() => {
        this.transferInProgress = false
      })
    },

    proceedToFinalize () {
      this.showOnlySelectedTools = true
      this.currentState = this.states.FINALIZING
      this.resetScrollPosition()
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
    background-color: #fff;
    padding: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    z-index: 5;
    min-height: 45px;
    display: flex;
    min-height: fit-content;
  }

  .tools-menu-container {
    overflow-y: auto;
    background-color: $background-light-gray;
    flex: 1 1 auto;
    -webkit-overflow-scrolling: touch;
  }

  .tool-scroll-container {
    background-color: $background-light-gray;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-top: 5px;
    flex: 1 1 auto;
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

    // TODO: upgrade parcel version (when it become available) so we can uncomment this
    // handle iPhone X style screens
    // bottom: calc(75px + constant(safe-area-inset-bottom));
    // bottom: calc(75px + env(safe-area-inset-bottom));
    width: 100vw;

    height: 57px;
    vertical-align: bottom;

    .transfer-btn {
      position: absolute;
      pointer-events: auto;
      left: calc(50% - 79px);
      bottom: 3.5px;
      z-index: 1;
    }

    .add-btn {
      position: absolute;
      right: 20px;
    }
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

      .dropdown {
        width: 246px;

        .selected-tag {
          font-size: 20px;
        }

        .dropdown-menu {
          top: -200px !important;
        }
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

  .form-control {
    display: none !important;
  }
}

// MOBILE

.mobile .tools-page {
  .tool-scroll-container {
    padding-bottom: 70px;
  }

  .floating-action-bar {
    display: inline-block;
    pointer-events: none;
    position: absolute;
    bottom: 75px;
    width: 100%;
    height: 57px;
    vertical-align: bottom;
  }

  .transfer-btn {
    position: absolute;
    left: calc(50% - 79px);
    bottom: 70px;
    width: 158px;
    z-index: 100;
  }
}

// DESKTOP

.desktop .tools-page {
  .tools-menu-container {
    display: flex !important;
    height: 100%;
    flex-direction: row;

    .tool-scroll-container {
      padding-bottom: 5px;
      align-content: center;
    }

    .floating-action-bar {
      position: inherit;
      z-index: 100;
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      height: auto;
      padding-top: 15px;
      align-items: center;
      flex: 1 1;
      max-width: 300px;

      .extended-fab {
        position: inherit;
        margin-left: 10px;
        margin-top: 20px;
      }

      .dark-input {
        width: 158px;
        margin-left: 10px;
        margin-top: 20px;
        font-size: 14px;
        height: 40px;
        font-weight: 500;

        .dropdown-menu {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
