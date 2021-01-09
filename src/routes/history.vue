<template>
  <div class="page history-page">
    <loading-overlay :active="loading"/>

    <div class="search-bar">
      <history-search-input
        :allow-tool-id-search="!currentToolId"
        :update-tags="updateTagFilters"
        :tags="tags"
      />

      <v-date-picker
        v-model="dateRange"
        :input-props="{ readonly: true }"
        :attributes="[{ popover: { visibility: 'hidden' } }]"
        :max-date="new Date()"
        :popover-visibility="datePickerVisibility"
        popover-direction="bottom"
        popover-align="right"
        mode="range"
        @input="toggleDatepicker"
      >
        <!-- slot-scope property required here -->
        <!-- eslint-disable vue/no-unused-vars -->
        <button
          slot-scope="scope"
          :class="{ active: !!dateRange }"
          class="fas fa-calendar-alt open-datepicker"
          @click="toggleDatepicker"
        />
      </v-date-picker>
    </div>
    <div class="menu-container">
      <fab
        v-if="$mq === 'mobile' && isNativeApp"
        :on-click="printTable"
        class="print-btn"
        icon-class="fa-print"
      />

      <fab
        v-if="$mq === 'mobile' && !isNativeApp"
        :on-click="exportTable"
        class="print-btn"
        icon-class="fa-file-pdf"
      />
      <div
        class="action-sidebar"
        v-if="$mq === 'desktop'"
      >
        <extended-fab
          v-if="isNativeApp"
          :on-click="printTable"
          icon-class="fa-print"
          button-text="PRINT"
        />

        <extended-fab
          v-if="!isNativeApp"
          :on-click="exportTable"
          icon-class="fa-file-pdf"
          button-text="DOWNLOAD"
        />

        <extended-fab
          v-if="isDecomissionedTool"
          :on-click="recover"
          icon-class="fa-undo-alt"
          button-text="RECOVER"
        />
      </div>
      <div class="report">
        <span
          v-if="!currentToolId"
          style="text-align: center; font-weight: 600;"
          class="title"
        >
          LATEST TRANSACTIONS
        </span>
        <span
          v-if="currentToolId"
          class="title"
        >
          <span
            class="fas fa-arrow-left back"
            @click="goBack"
          ></span>
          #{{ currentToolId }} {{ snapshots[0] && snapshots[0].currentSnapshot.brand.name }} {{ snapshots[0] && snapshots[0].currentSnapshot.type.name }}
        </span>

        <div id="export-table" class="scroll-container">
          <div
            class="list-loading-container loading-container"
            :class="{ 'active': $apollo.queries.searchToolSnapshot.loading }"
          >
            <loading-spinner/>
          </div>

          <div class="dt-body">
            <transition-group name="list-element">
              <history-search-result
                v-for="entry in snapshots"
                :key="entry.id"
                :entry="entry"
                :select-tool="selectHistoryEntry"
                :is-detail-result="!!currentToolId"
              >
              </history-search-result>
            </transition-group>
          </div>
        </div>
        <extended-fab
          v-if="$mq === 'mobile' && isDecomissionedTool"
          :on-click="recover"
          button-text="RECOVER"
          icon-class="fa-undo-alt"
          class="restore-efab"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { handleCommonErrors } from '@/utils/api-response-errors'
import HistorySearchInput from '@/components/history-search-input'
import ExtendedFab from '@/components/basic/extended-fab.vue'
import Fab from '@/components/basic/fab'
import swal from 'sweetalert2'
import HistorySearchResult from '@/components/history-search-result'
import LoadingSpinner from '@/components/basic/loading-spinner'
import LoadingOverlay from '@/components/basic/loading-overlay'
import statuses from '@/utils/statuses'
import { searchToolSnapshotQuery, recomissionToolMutation } from '@/utils/gql'
import { showSuccessMsg, showErrorMsg } from '@/utils/alerts'
import HistoryEntry from '@/models/history-entry'
import moment from 'moment'
import pdf from '@/mixins/pdf'

export default {
  name: 'History',

  mixins: [pdf],

  components: {
    HistorySearchInput,
    Fab,
    ExtendedFab,
    HistorySearchResult,
    LoadingSpinner,
    LoadingOverlay
  },

  apollo: {
    searchToolSnapshot: {
      query: searchToolSnapshotQuery,
      variables () {
        return {
          toolSnapshotFilter: {
            only_latest_snapshot: !this.currentToolId,
            tool_ids: this.currentToolId,
            time_span: this.dateRangeFilter,
            ...this.tagFilters
          }
        }
      },
      result (apiResult) {
        this.snapshots = apiResult.data.searchToolSnapshot.map(snapshot => new HistoryEntry(snapshot))
      }
    }
  },

  data () {
    return {
      filterMap: {
        USER: 'owner_ids',
        LOCATION: 'owner_ids',
        ACTION: 'tool_actions',
        TOOL: 'tool_ids',
        BRAND: 'brand_ids',
        TYPE: 'type_ids',
        STATUS: 'tool_statuses'
      },
      snapshots: [],
      tags: [],
      tagFilters: null,
      dateRange: null,
      isDatepickerShown: false,
      loading: false
    }
  },

  computed: {
    currentToolId () {
      return this.$route.query.toolId
    },

    isDecomissionedTool () {
      if (!this.snapshots.length) {
        return
      }

      return this.snapshots[0].currentSnapshot.status === statuses.BEYOND_REPAIR || this.snapshots[0].currentSnapshot.status === statuses.LOST_OR_STOLEN
    },

    datePickerVisibility () {
      return this.isDatepickerShown ? 'visible' : 'hidden'
    },

    isNativeApp () {
      return !!window.device && !!window.device.cordova
    },

    dateRangeFilter () {
      let dateRange
      if (this.dateRange) {
        dateRange = {}
        let startTime = moment(this.dateRange.start)
        let endTime = moment(this.dateRange.end)
        endTime.endOf('day')
        startTime.startOf('day')
        dateRange.start_time = startTime.toISOString()
        dateRange.end_time = endTime.toISOString()
      }
      return dateRange
    }
  },

  methods: {
    async recover () {
      let result = await swal({
        type: 'warning',
        title: 'CONFIRM RECOVERY',
        text: `Are you sure you want to recover this tool?`,
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonText: 'RECOVER',
        cancelButtonText: 'CANCEL',
        confirmButtonColor: '#CE352F'

      })

      if (result.value) {
        try {
          await this.$apollo.mutate({
            mutation: recomissionToolMutation,
            variables: {
              tool_id: this.currentToolId,
              status: 'AVAILABLE'
            }
          })

          showSuccessMsg('', 'TOOL RECOVERED')
          this.$apollo.queries.searchToolSnapshot.refresh()
        } catch (error) {
          if (handleCommonErrors(error)) {
            return
          }
          showErrorMsg()
          Vue.rollbar.error('Error in routes:history:recover', error)
        }
      }
    },

    goBack () {
      this.$router.push({ name: 'history' })
    },

    selectHistoryEntry (toolId) {
      this.$router.push({ name: 'history', query: { toolId } })
    },

    clearFilters () {
      this.dateRange = null
      this.tagFilters = null
      this.updateTagFilters()
    },

    updateDateFilterTag () {
      if (this.dateRange) {
        let idx = this.tags.findIndex(tag => tag.isDatespanFilter)
        let startTime = moment(this.dateRange.start)
        let endTime = moment(this.dateRange.end)
        let dateRangeTag = {
          isDatespanFilter: true,
          text: `${startTime.format('MM/DD')}-${endTime.format('MM/DD')}`,
          name: `${startTime.format('MM/DD')}-${endTime.format('MM/DD')}`,
          iconClass: 'fa-calendar-alt'
        }
        if (idx > -1) {
          Vue.set(this.tags, idx, dateRangeTag)
        } else {
          this.tags.push(dateRangeTag)
        }
      }
    },

    toggleDatepicker () {
      this.isDatepickerShown = !this.isDatepickerShown
      this.updateDateFilterTag()
    },

    async exportTable () {
      this.loading = true
      var data = this.snapshots.map(snapshot => [
        snapshot.currentSnapshot.id,
        `${ snapshot.currentSnapshot.brand.name } ${ snapshot.currentSnapshot.type.name }`,
        snapshot.currentSnapshot.owner.name,
        snapshot.currentSnapshot.status,
        new Date(snapshot.metadata.timestamp).toLocaleDateString('en-US'),
        snapshot.metadata.tool_action,
      ])
      var header = ['ID', 'Tool', 'Assigned To', 'Status', 'Date', 'Action']
      try {
        this.generatePdfFromObject(data, header, 'transactions_export.pdf')
      } catch (error) {
        showErrorMsg('Error exporting PDF. Please try again or contact support.')
        Vue.rollbar.error('Error in routes:history:exportTable', error)
      }
      this.loading = false
    },

    async printTable () {
      var data = this.snapshots.map(snapshot => [
        snapshot.currentSnapshot.id,
        `${ snapshot.currentSnapshot.brand.name } ${ snapshot.currentSnapshot.type.name }`,
        snapshot.currentSnapshot.owner.name,
        snapshot.currentSnapshot.status,
        new Date(snapshot.metadata.timestamp).toLocaleDateString('en-US'),
        snapshot.metadata.tool_action,
      ])
      var header = ['ID', 'Tool', 'Assigned To', 'Status', 'Date', 'Action']
      let datauri = await this.generateDataUrlFromObject(data, header, 'transactions_export.pdf')
      window.cordova.plugins.printer.print(datauri, { name: 'retina_history.html', landscape: true })
    },

    checkDateFilter () {
      let hasDateFilter = this.tags.some(tag => tag.isDatespanFilter)
      if (!hasDateFilter && this.dateRange) {
        this.dateRange = null
      }
    },

    updateTagFilters (filters = []) {
      this.tags = filters
      let newFilters = filters.length ? {} : null
      filters.forEach(filter => {
        if (!filter.isDatespanFilter) {
          let key = this.filterMap[filter.type]

          if (!newFilters[key]) {
            newFilters[key] = [filter.id]
          } else {
            newFilters[key].push(filter.id)
          }
        }
      })
      this.checkDateFilter()
      this.tagFilters = newFilters
    }
  }
}
</script>

<style lang="scss">

.history-page {
  display: flex;
  flex-direction: column;
  max-width: 100vw;

  .history-table-export {
    display: none !important;
  }

  .active {
    color: $renascent-red;
  }

  .popover-container {
    width: 55px;

    .open-datepicker {
      font-size: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
    }
  }

  .report {
    display: none;
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1 1 auto;
    align-items: center;

    .restore-efab {
      position: absolute;
      margin-top: auto;
      bottom: 75px;
      width: 158px;
    }

    .scroll-container {
      width: calc(100% - 24px);
    }

    .title {
      text-align: center;
      font-weight: 600;
      line-height: 28px;
      margin-top: 12px;
      padding-left: 12px;
      padding-right: 12px;
      width: calc(100% - 24px);

      .back {
        color: $renascent-red;
        font-size: 28px;
        float: left;
        height: 25px;
        width: 25px;
        line-height: 28px;
      }
    }
  }

  .export-btn {
    position: absolute;
    right: 30px;
    pointer-events: auto;
  }

  .print-btn {
    position: absolute;
    right: 20px;
    bottom: 80px;
    bottom: max(calc(80px + constant(safe-area-inset-bottom) - 18px), 80px);
    bottom: max(calc(80px + env(safe-area-inset-bottom) - 18px), 80px);
    z-index: 100;
  }
}

.desktop .history-page {
  .loading-container {
    max-width: 100%;
  }
}
</style>
