<template>
  <div class="page tools-page">
    <div class="search-bar">
      <tool-search-input
        :tags="tags"
        :update-tags="updateFilters"
        :disable-user-search="isNonAdminTransfer">
      </tool-search-input>
      <nfc-scan :on-scan="onScan"></nfc-scan>
    </div>

    <transition name="fade">
      <div
        v-if="transferInProgress"
        class="overlay">
        <div class="half-circle-spinner">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
        </div>
      </div>
    </transition>

    <extended-fab
      v-if="$mq === 'mobile' && currentState === states.INITIAL"
      :on-click="moveToSelectingState"
      class="transfer-btn"
      icon-class="fa-exchange-alt"
      button-text="TRANSFER">
    </extended-fab>
    <div class="tools-menu-container">
      <div
        class="floating-action-bar">
        <extended-fab
          v-if="$mq === 'desktop' && currentState === states.INITIAL"
          :on-click="moveToSelectingState"
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
          :disabed="numSelectedTools === 0"
          :class="{ disabled: numSelectedTools === 0 }"
          class="view-fab-btn next-btn"
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
          :on-click="moveToSelectingState"
          class="back-efab"
          icon-class="fa-arrow-left"
          button-text="BACK">
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

      <div
        v-infinite-scroll="loadMore"
        ref="scrollElement"
        :class="{ finalizing: currentState === states.FINALIZING }"
        infinite-scroll-throttle-delay="200"
        class="tool-scroll-container">
        <add-button
          v-if="$mq === 'mobile' && currentState === states.INITIAL"
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
            :disabed="numSelectedTools === 0"
            :class="{ disabled: numSelectedTools === 0 }"
            class="fas fa-arrow-right menu-icon next-btn"
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
            :on-click="moveToSelectingState"
            :outline-display="true"
            class="back-efab"
            icon-class="fa-arrow-left"
            button-text="BACK">
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

    getMultipleTool: {
      query: gql`query selectedTools($tool_ids: [ID!]!) {
        getMultipleTool(tool_ids: $tool_ids) {
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
        return {
          tool_ids: this.$store.getters.selectedTools
        }
      }
    },

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

        if (this.isNonAdminTransfer) {
          if (!options.toolFilter) {
            options.toolFilter = {}
          }
          if (!options.toolFilter.owner_ids || !options.toolFilter.owner_ids.length) {
            options.toolFilter.owner_ids = [...this.locationIds, this.currentUser.id]
          }
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
      pageSize: 15,
      searchString: null,
      filters: null,
      paginationLoading: false,
      transferInProgress: false,
      tags: [],
      states
    }
  },

  computed: {
    infiniteScrollPageNumber () {
      return Math.ceil(this.tools.length / this.pageSize)
    },

    currentUser () {
      return JSON.parse(window.localStorage.getItem('currentUser'))
    },

    isAdmin () {
      return this.currentUser.role === Roles.ADMIN
    },

    isNonAdminTransfer () {
      return this.currentState === this.states.SELECTING && !this.isAdmin
    },

    showOnlySelectedTools () {
      return this.$store.state.showOnlySelectedTools
    },

    currentState () {
      return this.$store.state.transferState
    },

    tools () {
      if (this.showOnlySelectedTools) {
        return this.getMultipleTool || []
      }

      let tools = this.searchTool || []

      if (this.isNonAdminTransfer) {
        tools = tools.filter(tool => tool.owner.type !== 'LOCATION' || tool.status === 'AVAILABLE')
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

    locationIds () {
      return this.locations.map(location => location.id)
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

  methods: {
    showTransferSuccessMsg () {
      swal({
        type: 'success',
        title: 'TRANSFER SUCCESS',
        text: 'Successfully Transferred Tools',
        timer: 1500,
        showConfirmButton: false
      })
    },

    showTransferErrorMsg () {
      swal({
        type: 'error',
        title: 'TRANSFER ERROR',
        text: 'Error Transferring Tools. Please Try Again or Contact Support',
        timer: 2000,
        showConfirmButton: false
      })
    },

    clearSearchFilters () {
      this.filters = null
      this.tags = []
    },

    resetInfiniteScroll () {
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

    updateFilters (tags = [], fuzzySearch) {
      this.tags = tags
      this.searchString = fuzzySearch

      let newFilters = tags.length ? {} : null
      tags.forEach(filter => {
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

    moveToSelectingState () {
      this.$store.commit('setShowOnlySelectedTools', false)
      this.$store.commit('updateTransferStatus', this.states.SELECTING)
      if (!this.isAdmin) {
        this.clearSearchFilters()
      }
    },

    cancelTransfer () {
      this.$store.commit('resetSelectedTools')
      this.$store.commit('setShowOnlySelectedTools', false)
      this.$store.commit('updateTransferStatus', this.states.INITIAL)
      this.resetScrollPosition()
    },

    toggleViewSelected () {
      this.$store.commit('toggleShowOnlySelectedTools')
      this.resetScrollPosition()
    },

    loadMore () {
      if (this.hasLoadedLastPage || !this.tools.length || this.$apollo.queries.searchTool.loading || this.showOnlySelectedTools) {
        return
      }

      this.paginationLoading = true

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
        this.$store.commit('setShowOnlySelectedTools', false)
        this.$store.commit('updateTransferStatus', this.states.INITIAL)
        this.showTransferSuccessMsg()
        this.$apollo.queries.searchTool.refetch()
      }).catch(() => {
        this.showTrasnferErrorMsg()
      }).finally(() => {
        this.transferInProgress = false
      })
    },

    proceedToFinalize () {
      this.$store.commit('setShowOnlySelectedTools', true)
      this.$store.commit('updateTransferStatus', this.states.FINALIZING)
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
    display: flex;
    height: calc(100% - 67px);
    background-color: $background-light-gray;
    flex: 1 1 auto;
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

  .next-btn.disabled {
    opacity: .5;
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
}

.mobile .tools-page {
  .tool-scroll-container {
    padding-bottom: 70px;

    &.finalizing {
      padding-bottom: 200px;
    }

    .floating-action-bar {
      display: none !important;
    }
  }

  .transfer-btn {
    position: absolute;
    left: calc(50% - 79px);
    bottom: 70px;
    // TODO: upgrade parcel version (when it become available) so we can uncomment this
    // handle iPhone X style screens
    bottom: calc(70px + constant(safe-area-inset-bottom));
    bottom: calc(70px + env(safe-area-inset-bottom));
    width: 158px;
    z-index: 100;
  }
}

.desktop .tools-page {
  .tools-menu-container {
    .tool-scroll-container {
      padding-bottom: 5px;
    }

    .floating-action-bar {
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      padding-top: 15px;
      align-items: center;
      flex: 1 1 auto;
      max-width: 300px;

      .extended-fab {
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
