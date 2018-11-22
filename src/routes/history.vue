<template>
  <div class="page history-page">
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
        <div
          id="export-table"
          style="width: 100%;
          font-size: 14px;
          padding: 12px 12px 0px 12px;
          display: flex;
          flex-direction: column">
          <div
            class="dt-head"
            style="display: flex;
            flex: 1 0 auto;
            border-radius: 3px;
            background-color: #404040;
            font-size: 16px;
            height: 40px;
            align-items: center;
            color: #fff;
            text-align: left;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
            font-weight: 600;">
            <div
              class="dt-cell id"
              style="display: flex;
                flex: 0 0 40px;
                justify-content: center;
                padding: 0;">
              <span>id</span>
            </div>
            <div
              class="dt-cell tool"
              style="display: flex;
                justify-content: center;
                flex: 0 0 calc(33% - 15px);
                margin-left: 10px">
              <span>tool</span>
            </div>
            <div
              class="dt-cell date"
              style="display: flex;
                justify-content: center;
                flex: 0 0 calc(33% - 15px);">
              <span>date</span>
            </div>
            <div
              class="dt-cell action"
              style="display: flex;
                justify-content: center;
                flex: 0 0 calc(33% - 15px);">
              <span>action</span>
            </div>
          </div>


          <transition name="list-loading">
            <div
              v-if="$apollo.queries.searchToolHistoryEntry.loading"
              class="loading-container">
              <div
                class="loading">
              </div>
            </div>
          </transition>

          <div
            class="dt-body"
            style="display: flex;
              flex-direction: column;
              overflow: auto;
              padding: 4px;">
            <transition-group name="list-element">
              <div
                v-for="entry in searchToolHistoryEntry"
                :key="entry.id"
                class="dt-row"
                style="display: flex;
                border-radius: 3px;
                border-bottom: solid 1px lightgray;
                background-color: white;
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);">
                <div
                  class="dt-cell id"
                  style="display: flex;
                  flex: 0 0 40px;
                  justify-content: center;
                  padding: 0;
                  display: flex;
                  align-items: center;
                  height: 45px;
                  font-weight: 600; border-right: solid 1px lightgray;">
                  <span>{{ entry.tool_snapshot.id }}</span>
                </div>
                <div
                  class="dt-cell name"
                  style="display: flex;
                  justify-content: flex-start;
                  margin-left: 10px;
                  display: flex;
                  align-items: center;
                  flex-direction: row;
                  height: 45px;
                  font-weight: 600;
                  flex: 0 0 calc(33% - 15px);">
                  <span>{{ `${ entry.tool_snapshot.brand.name } ${ entry.tool_snapshot.type.name }` }}</span>
                </div>
                <div
                  class="dt-cell date"
                  style="display: flex;
                  justify-content: center;
                  display: flex;
                  align-items: center;
                  height: 45px;
                  font-weight: 600;
                  flex: 0 0 calc(33% - 15px);">
                  <span>{{ new Date(entry.metadata.timestamp).toLocaleDateString('en-US', { timeZone: 'UTC' }) }}</span>
                </div>
                <div
                  class="dt-cell action"
                  style="display: flex;
                  justify-content: center;
                  flex: 0 0 calc(33% - 15px);
                  display: flex;
                  align-items: center;
                  height: 45px;
                  font-weight: 600;">
                  <span>{{ entry.metadata.tool_action }}</span>
                </div>
              </div>
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

export default {
  name: 'History',
  components: {
    HistorySearchInput,
    Avatar,
    Fab,
    ExtendedFab
  },

  apollo: {
    searchToolHistoryEntry: {
      query: gql`query searchToolHistoryEntry{
        searchToolHistoryEntry {
          id,
          tool_snapshot {
            id,
            type {
              id,
              name
            },
            brand {
              id,
              name
            }
          },
          metadata {
            timestamp,
            tool_action
          }
        }
      }`,
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
      searchToolHistoryEntry: [],
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
      console.log(this.searchToolHistoryEntry)
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
      var element = document.getElementById('export-table')

      var opt = {
        filename: 'transactions_export.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
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
    padding-top: 80px;
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
