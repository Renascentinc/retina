<template>
  <div class="page tools-page">
    <loading-overlay :active="transferInProgress"/>

    <div class="search-bar">
      <tool-search-input
        :clear-fuzzy-filter="clearFuzzyFilter"
        :tags="tags"
        :update-tags="updateFilters"
        :disable-user-search="isNonAdminTransfer"
      />
      <nfc-scan :on-scan="onScan"/>
    </div>

    <extended-fab
      v-if="$mq === 'mobile' && transferState === states.INITIAL"
      :on-click="moveToSelectingState"
      class="transfer-btn"
      icon-class="fa-exchange-alt"
      button-text="TRANSFER"
    />

    <div class="menu-container">
      <div
        class="action-sidebar"
        v-if="$mq === 'desktop'"
      >
        <extended-fab
          v-if="transferState === states.INITIAL"
          :on-click="moveToSelectingState"
          class="transfer-btn"
          icon-class="fa-exchange-alt"
          button-text="TRANSFER"
        />

        <extended-fab
          v-if="transferState === states.SELECTING"
          :on-click="cancelTransfer"
          class="cancel-fab-btn"
          icon-class="fa-times"
          button-text="CANCEL"
        />

        <extended-fab
          v-if="transferState === states.SELECTING"
          :on-click="toggleViewSelected"
          :icon-class="showOnlySelectedTools ? 'fa-check-square' : 'fa-list'"
          :button-text="showOnlySelectedTools ? 'VIEW ALL' : 'VIEW SELECTED'"
          class="view-fab-btn"
        />

        <extended-fab
          v-if="transferState === states.SELECTING"
          :on-click="proceedToFinalize"
          :disabled="numSelectedTools === 0"
          :class="{ disabled: numSelectedTools === 0 }"
          class="view-fab-btn next-btn"
          icon-class="fa-arrow-right"
          button-text="NEXT"
        />

        <extended-fab
          v-if="transferState === states.INITIAL"
          :on-click="transitionToAdd"
          class="add-btn"
          icon-class="fa-plus"
          button-text="ADD TOOL"
        />

        <extended-fab
          v-if="transferState === states.FINALIZING"
          :on-click="moveToSelectingState"
          class="back-efab"
          icon-class="fa-arrow-left"
          button-text="BACK"
        />

        <v-select
          v-if="transferState === states.FINALIZING"
          v-model="transferTarget"
          :options="transferTargets"
          :filterable="false"
          class="dark-input"
        />

        <extended-fab
          v-if="transferState === states.FINALIZING"
          :on-click="finalizeTransfer"
          :disabled="!transferTarget.id || numSelectedTools === 0"
          class="finish-transfer"
          icon-class="fa-arrow-right"
          button-text="FINISH"
        />
      </div>

      <div
        v-infinite-scroll="loadMore"
        ref="scrollElement"
        :class="{ finalizing: transferState === states.FINALIZING }"
        infinite-scroll-throttle-delay="200"
        class="scroll-container"
      >
        <add-button
          v-if="$mq === 'mobile' && transferState === states.INITIAL"
          :key="0"
          :on-click="transitionToAdd"
          text="TOOL"
        />

        <div
          class="list-loading-container loading-container"
          :class="{ 'active': $apollo.queries.searchTool.loading }"
        >
          <loading-spinner/>
        </div>

        <transition name="fade">
          <div
            v-if="!$apollo.queries.searchTool.loading && !tools.length"
            class="no-results-container"
          >
            <span class="no-tools-text">
              No Tools To Display
            </span>
          </div>
        </transition>

        <transition-group
          name="list-element"
          tag="span"
        >
          <tool-search-result
            v-for="tool in tools"
            :key="tool.id"
            :tool="tool"
            :on-select="transitionToToolInfo"
            :show-select="transferState !== states.INITIAL"
          />
        </transition-group>

        <div
          class="list-loading-container loading-container"
          :class="{ 'active': $apollo.queries.searchTool.loading && paginationLoading }"
        >
          <loading-spinner/>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="$mq === 'mobile' && transferState === states.SELECTING"
        class="nav-bar selection-action-bar"
      >
        <div class="icon-text-container">
          <button
            class="fas fa-times menu-icon"
            @click="cancelTransfer"
          >
            <span class="icon-subtext">
              CANCEL
            </span>
          </button>
        </div>
        <div class="icon-text-container">
          <button
            :class="{ 'fa-check-square': !showOnlySelectedTools, 'fa-list': showOnlySelectedTools }"
            class="fas menu-icon"
            @click="toggleViewSelected"
          >
            <span class="icon-subtext">
              {{ showOnlySelectedTools ? 'VIEW ALL' : 'VIEW SELECTED' }}
            </span>
          </button>
        </div>
        <div class="icon-text-container">
          <button
            :disabled="numSelectedTools === 0"
            :class="{ disabled: numSelectedTools === 0 }"
            class="fas fa-arrow-right menu-icon next-btn"
            @click="proceedToFinalize"
          >
            <span class="icon-subtext">
              NEXT
            </span>
          </button>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="$mq === 'mobile' && transferState === states.FINALIZING"
        class="finalizing-action-bar"
      >
        <div class="finalize-row finalize-header">
          <span> Transfer {{ formattedNumSelectedTools }} </span>
        </div>

        <div class="finalize-row finalize-middle">
          <span class="finalize-to-text">
            To
          </span>
          <v-select
            v-model="transferTarget"
            :options="transferTargets"
            :searchable="false"
            class="dark-input"
          />
        </div>

        <div class="finalize-row finalize-footer">
          <extended-fab
            :on-click="moveToSelectingState"
            :outline-display="true"
            class="back-efab"
            icon-class="fa-arrow-left"
            button-text="BACK"
          />

          <extended-fab
            :on-click="finalizeTransfer"
            :disabled="!transferTarget.id || numSelectedTools === 0"
            class="finish-transfer"
            icon-class="fa-arrow-right"
            button-text="FINISH"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ToolSearchInput from '@/components/tool-search-input'
import ToolSearchResult from '@/components/tool-search-result'
import ExtendedFab from '@/components/basic/extended-fab'
import NfcScan from '@/components/nfc-scan'
import AddButton from '@/components/add-button'
import vSelect from '@/components/basic/select'
import Platforms from '@/utils/platforms'
import nfcMixin from '@/mixins/nfc'
import LoadingOverlay from '@/components/basic/loading-overlay'
import LoadingSpinner from '@/components/basic/loading-spinner'
import Tool from '@/models/tool'
import { mapGetters, mapState, mapMutations } from 'vuex'
import {
  locationsQuery,
  usersQuery,
  multiToolQuery,
  searchToolsQuery,
  toolTransferMutation
} from '@/utils/gql'
import {
  showSuccessMsg,
  showErrorMsg
} from '@/utils/alerts'

export default {
  name: 'Tools',

  components: {
    LoadingOverlay,
    LoadingSpinner,
    ToolSearchInput,
    ToolSearchResult,
    ExtendedFab,
    vSelect,
    NfcScan,
    AddButton
  },

  mixins: [ nfcMixin ],

  apollo: {
    getAllLocation: {
      query: locationsQuery
    },

    getAllUser: {
      query: usersQuery
    },

    getMultipleTool: {
      query: multiToolQuery,
      variables () {
        return {
          tool_ids: this.selectedTools
        }
      },
      update (data) {
        return data.getMultipleTool.map(tool => new Tool(tool))
      }
    },

    searchTool: {
      query: searchToolsQuery,

      variables () {
        let options = {
          pagingParameters: {
            page_size: this.pageSize,
            page_number: this.pageNumber
          }
        }

        if (this.searchString) options.query = this.searchString
        if (this.filters) options.toolFilter = this.filters

        if (this.isNonAdminTransfer) {
          if (!options.toolFilter) {
            options.toolFilter = {}
          }
          if (!options.toolFilter.owner_ids || !options.toolFilter.owner_ids.length) {
            options.toolFilter.owner_ids = [...this.locationIds, this.currentUser.id]
          }
        }

        return options
      },
      update (data) {
        return data.searchTool.map(tool => new Tool(tool))
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
      clearFuzzyFilter: false,
      tags: [],
      states
    }
  },

  computed: {
    ...mapState('tools', [
      'showOnlySelectedTools',
      'transferState'
    ]),

    ...mapState('auth', [
      'currentUser'
    ]),

    ...mapGetters('auth', [
      'isAdminUser'
    ]),

    ...mapGetters('tools', [
      'selectedTools'
    ]),

    infiniteScrollPageNumber () {
      let tools = (this.showOnlySelectedTools ? this.getMultipleTool : this.searchTool) || []
      return Math.ceil(tools.length / this.pageSize)
    },

    isNonAdminTransfer () {
      return this.transferState === this.states.SELECTING && !this.isAdminUser
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
      return this.selectedTools.length
    },

    formattedNumSelectedTools () {
      return `${this.numSelectedTools} ${this.numSelectedTools === 1 ? 'tool' : 'tools'}`
    }
  },

  mounted () {
    if (this.checkIsNfcEnabled() && window.device.platform === Platforms.ANDROID) {
      // add a noop nfc listener to keep nfc scans on android from bubbling up to the OS
      window.nfc.addNdefListener(() => 0)
    }
  },

  methods: {
    ...mapMutations('tools', [
      'toggleToolSelection',
      'toggleShowOnlySelectedTools',
      'setShowOnlySelectedTools',
      'updateTransferStatus',
      'resetSelectedTools'
    ]),

    clearSearchFilters () {
      this.filters = null
      this.tags = []
      this.clearFuzzyFilter = !this.clearFuzzyFilter
    },

    resetInfiniteScroll () {
      this.hasLoadedLastPage = false
      this.resetScrollPosition()
    },

    resetScrollPosition () {
      this.$refs.scrollElement.scrollTo(0, 0)
    },

    onScan (value) {
      if (this.transferState === this.states.INITIAL) {
        this.transitionToToolInfo(value)
      } else {
        this.toggleToolSelection(value)
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
      this.setShowOnlySelectedTools(false)
      this.updateTransferStatus(this.states.SELECTING)
      if (!this.isAdminUser) {
        this.clearSearchFilters()
        this.resetScrollPosition()
      }
    },

    cancelTransfer () {
      this.resetSelectedTools()
      this.setShowOnlySelectedTools(false)
      this.updateTransferStatus(this.states.INITIAL)
      this.resetInfiniteScroll()
    },

    toggleViewSelected () {
      this.toggleShowOnlySelectedTools()
      this.resetScrollPosition()
    },

    async loadMore () {
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

      if (this.searchString) options.query = this.searchString
      if (this.filters) options.toolFilter = this.filters

      await this.$apollo.queries.searchTool.fetchMore({
        variables: options,

        updateQuery: (previousResult, { fetchMoreResult }) => {
          this.hasLoadedLastPage = !fetchMoreResult.searchTool.length
          return {
            searchTool: [...previousResult.searchTool, ...fetchMoreResult.searchTool]
          }
        }
      })

      this.paginationLoading = false
    },

    async finalizeTransfer () {
      this.transferInProgress = true
      try {
        let { data: { transferMultipleTool } } = await this.$apollo.mutate({
          mutation: toolTransferMutation,
          variables: {
            tool_id_list: this.selectedTools,
            to_owner_id: this.transferTarget.id
          }
        })

        this.resetScrollPosition()
        transferMultipleTool.forEach(tool => {
          let idx = this.searchTool.findIndex(entry => entry.id === tool.id)
          this.searchTool[idx] = tool
        })
        this.resetSelectedTools()
        this.setShowOnlySelectedTools(false)
        this.updateTransferStatus(this.states.INITIAL)
        showSuccessMsg('Transfer Successful')
      } catch {
        showErrorMsg('Error Transferring Tools. Please Try Again or Contact Support')
      }

      this.transferInProgress = false
    },

    proceedToFinalize () {
      this.setShowOnlySelectedTools(true)
      this.updateTransferStatus(this.states.FINALIZING)
      this.resetScrollPosition()
    }
  }
}
</script>

<style lang="scss">

.tools-page {
  display: flex;
  flex-direction: column;

  .next-btn.disabled {
    opacity: .5;
  }

  .scroll-container {
    // important to make sure infinite scrolling works
    height: fit-content;
    max-height: calc(100% - 10px);
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
  .transfer-btn {
    position: absolute;
    left: calc(50% - 79px);
    bottom: 70px;
    bottom: calc(70px + constant(safe-area-inset-bottom));
    bottom: calc(70px + env(safe-area-inset-bottom));
    width: 158px;
    z-index: 100;
  }
}
</style>
