<template>
  <div class="page history-page">
    <loading-overlay :active="loading"/>

    <!-- this is the actual table that gets printed or exported to PDF. Invisible to the user -->
    <history-table
      :search-tool-snapshot="snapshots"
    />

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
import HistorySearchInput from '@/components/history-search-input'
import ExtendedFab from '@/components/basic/extended-fab.vue'
import Fab from '@/components/basic/fab'
import html2pdf from 'html2pdf.js'
import swal from 'sweetalert2'
import HistoryTable from '@/components/history-table'
import HistorySearchResult from '@/components/history-search-result'
import LoadingSpinner from '@/components/basic/loading-spinner'
import LoadingOverlay from '@/components/basic/loading-overlay'
import statuses from '@/utils/statuses'
import { searchToolSnapshotQuery, recomissionToolMutation } from '@/utils/gql'
import { showSuccessMsg, showErrorMsg } from '@/utils/alerts'
import HistoryEntry from '@/models/history-entry'

export default {
  name: 'History',

  components: {
    HistorySearchInput,
    Fab,
    ExtendedFab,
    HistoryTable,
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
      },
      fetchPolicy: 'network-only'
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
        let startTime = new Date(this.dateRange.start)
        let endTime = new Date(this.dateRange.end)
        endTime.setDate(endTime.getDate() + 1)
        endTime.setUTCHours(23)
        startTime.setUTCHours(0)
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
          window.console.error(error)
          showErrorMsg()
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
        let startTime = new Date(this.dateRange.start)
        let endTime = new Date(this.dateRange.end)
        let dateRangeTag = {
          isDatespanFilter: true,
          text: `${startTime.getMonth() + 1}/${startTime.getDate()}-${endTime.getMonth() + 1}/${endTime.getDate()}`,
          name: `${startTime.getMonth() + 1}/${startTime.getDate()}-${endTime.getMonth() + 1}/${endTime.getDate()}`,
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
      let element = document.querySelector('.history-table-export')

      let options = {
        filename: 'transactions_export.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
        margin: 0.5,
        pagebreak: {
          mode: 'avoid-all'
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }

      try {
        await html2pdf().from(element).set(options).save()
        this.loading = false
      } catch (error) {
        window.console.error(error)
        showErrorMsg()
      }
    },

    printTable () {
      let element = document.querySelector('.history-table-export')
      window.cordova.plugins.printer.print(element, { name: 'retina_history.html', landscape: true })
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
    right: 30px;
    bottom: 70px;
    bottom: calc(70px + constant(safe-area-inset-bottom));
    bottom: calc(70px + env(safe-area-inset-bottom));
    z-index: 100;
  }
}

.desktop .history-page {
  .loading-container {
    max-width: 100%;
  }
}
</style>
