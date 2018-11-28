<template>
  <div class="page history-page">
    <history-table
      id="history-table-export"
      :search-tool-snapshot="searchToolSnapshot">
    </history-table>
    <div class="search-bar">
      <history-search-input
        :update-tags="updateTagFilters"
        :tags="tags">
      </history-search-input>
      <v-date-picker
        v-model="dateRange"
        :input-props="{ readonly: true }"
        :attributes="[{ popover: { visibility: 'hidden' } }]"
        :max-date="new Date()"
        :popover-visibility="datePickerVisibility"
        popover-direction="bottom"
        popover-align="right"
        mode="range"
        @input="toggleDatepicker">
        <button
          slot-scope="scope"
          :class="{ active: !!dateRange }"
          class="fas fa-calendar-alt open-datepicker"
          @click="toggleDatepicker">
        </button>
      </v-date-picker>
    </div>
    <div class="history-main-content">
      <div
        class="floating-action-bar">

        <extended-fab
          v-if="$mq === 'desktop' && isNativeApp"
          :on-click="printTable"
          icon-class="fa-print"
          button-text="PRINT">
        </extended-fab>

        <extended-fab
          v-if="$mq === 'desktop'"
          :on-click="exportTable"
          icon-class="fa-file-pdf"
          button-text="DOWNLOAD">
        </extended-fab>

        <fab
          v-if="$mq === 'mobile' && isNativeApp"
          :on-click="printTable"
          class="print-btn"
          icon-class="fa-print">
        </fab>
      </div>
      <div class="report">
        <div id="export-table">
          <span
            v-if="!currentToolId"
            style="text-align: center;
            font-weight: 600;">
            LATEST TRANSACTIONS
          </span>

          <span
            v-if="currentToolId"
            class="title">
            <span
              class="fas fa-arrow-left back"
              @click="viewGlobalEntries"></span>
            #{{ currentToolId }} {{ searchToolSnapshot[0] && searchToolSnapshot[0].tool.brand.name }} {{ searchToolSnapshot[0] && searchToolSnapshot[0].tool.type.name }}
          </span>

          <transition name="list-loading">
            <div
              v-if="$apollo.queries.searchToolSnapshot.loading"
              class="loading-container">
              <div
                class="loading">
              </div>
            </div>
          </transition>

          <div class="dt-body">
            <transition-group name="list-element">
              <history-search-result
                v-for="entry in searchToolSnapshot"
                :entry="entry"
                :select-tool="selectHistoryEntry"
                :is-detail-result="!!currentToolId"
                :key="entry.id">
              </history-search-result>
            </transition-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import HistorySearchInput from '../components/history-search-input'
import ExtendedFab from '../components/extended-fab.vue'
import Avatar from 'vue-avatar'
import Fab from '../components/fab'
import html2pdf from 'html2pdf.js'
import gql from 'graphql-tag'
import swal from 'sweetalert2'
import HistoryTable from '../components/history-table'
import HistorySearchResult from '../components/history-search-result'

export default {
  name: 'History',

  components: {
    HistorySearchInput,
    Avatar,
    Fab,
    ExtendedFab,
    HistoryTable,
    HistorySearchResult
  },

  apollo: {
    searchToolSnapshot: {
      query: gql`query searchToolSnapshot($toolSnapshotFilter: ToolSnapshotFilter){
        searchToolSnapshot(toolSnapshotFilter: $toolSnapshotFilter){
          id,
          tool {
            id,
            brand {
              id,
              name
            },
            type {
              id,
              name
            },
            status
          }
          metadata {
            timestamp,
            tool_action
          }
        }
      }`,
      variables () {
        return {
          toolSnapshotFilter: {
            only_latest_snapshot: this.currentToolId ? false : true,
            tool_ids: this.currentToolId
          }
        }
      },
      fetchPolicy: 'cache-and-network'
    }
  },

  data () {
    return {
      filterMap: {
        USER: 'owner_ids',
        LOCATION: 'owner_ids',
        ACTION: 'tool_actions',
        TOOL: 'tool_ids'
      },
      currentToolId: this.$router.currentRoute.params.toolId,
      searchToolSnapshot: [],
      tags: [],
      tagFilters: null,
      dateRange: null,
      isDatepickerShown: false
    }
  },

  computed: {
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
        endTime.setUTCHours(0)
        startTime.setUTCHours(0)
        dateRange.start_time = startTime.toISOString()
        dateRange.end_time = endTime.toISOString()
      }
      return dateRange
    },

    filters () {
      return { time_span: this.dateRangeFilter, ...this.tagFilters }
    }
  },

  methods: {
    viewGlobalEntries () {
      this.currentToolId = null;
      this.$router.push({path: '/history'})
    },

    selectHistoryEntry (toolId) {
      this.$router.push({name: 'historyDetail', params: {toolId}})
      this.currentToolId = toolId
    },

    updateDateFilterTag () {
      if (this.dateRange) {
        let idx = this.tags.findIndex(tag => tag.isDatespanFilter)
        let startTime = new Date(this.dateRange.start)
        let endTime = new Date(this.dateRange.end)
        let dateRangeTag = {
          isDatespanFilter: true,
          text: `${startTime.getMonth()}/${startTime.getDate()}-${endTime.getMonth()}/${endTime.getDate()}`,
          name: `${startTime.getMonth()}/${startTime.getDate()}-${endTime.getMonth()}/${endTime.getDate()}`,
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

    exportTable () {
      var element = document.getElementById('history-table-export')

      var opt = {
        filename: 'transactions_export.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
        margin: 0.5,
        pagebreak: {
          mode: 'avoid-all'
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }

      html2pdf().from(element).set(opt).save()
    },

    printTable () {
      var element = document.getElementById('export-table')
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
@import '../styles/variables';

.desktop {
  .history-page {
    .loading-container {
      max-width: 100%;
    }

    .search-bar {
      background-color: #fff;
      width: calc(100vw - 80px);
    }

    .search-input {
      margin-right: 0;
    }
  }

  .floating-action-bar {
    min-width: 180px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    max-width: 300px;
    flex: 1 1 auto;
    padding-top: 15px;
    overflow-y: auto;

    .extended-fab {
      margin-left: 10px;
      margin-top: 20px;
    }
  }
}

.mobile {
  .floating-action-bar {
    display: inline-block;
    position: absolute;
    bottom: 75px;
    width: 100%;
    height: 57px;
    vertical-align: bottom;
  }
}

.history-page {
  display: flex;
  flex-direction: column;
  max-width: 100vw;

  .loading-container {
    width: calc(100% - 40px);
  }

  .history-main-content {
    display: flex;
    background-color: $background-light-gray;
    height: 100%;
    overflow: hidden;
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

  .search-bar {
    background-color: #fff;
    padding: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    z-index: 5;
    display: flex;
    min-height: fit-content;
  }

  .report {
    display: none;
    display: flex;
    height: 100%;
    flex: 1 1 auto;

    #export-table {
      width: 100%;
      font-size: 14px;
      padding: 12px 12px 0px 12px;
      display: flex;
      flex-direction: column;
      -webkit-overflow-scrolling: touch;
      overflow-y: auto;

    }

    .title {
      text-align: center;
      font-weight: 600;
      line-height: 25px;

      .back {
        color: $renascent-red;
        font-size: 22px;
        float: left;
        height: 25px;
        width: 25px;
        line-height: 25px;
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
    pointer-events: auto;
  }
}
</style>
