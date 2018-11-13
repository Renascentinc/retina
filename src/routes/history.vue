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
        :attributes="{ popover: { visibility: 'hidden' } }"
        :max-date="new Date()"
        popover-visibility="focus"
        popover-direction="bottom"
        popover-align="right"
        mode="range"
        @popover-did-appear="() => isDatepickerShown = true"
        @popover-did-disappear="() => { isDatepickerShown = false; updateDateFilterTag() }">

        <button
          slot-scope="{ inputValue, updateValue }"
          :class="{ active: !!dateRange }"
          class="fas fa-calendar-alt open-datepicker"
          @click="() => toggleDatepicker(inputValue, updateValue)">
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
          icon-class="fa-file-download"
          button-text="EXPORT PDF">
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
          style="width: 980px; min-width: 980px; padding: 20px;">
          <div
            class="dt-head"
            style="display: flex;
            border-radius: 3px;
            background-color: #404040;
            font-size: 20px;
            height: 40px;
            align-items: center;
            color: #fff;
            text-align: left;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
            font-weight: 900;">
            <div
              class="dt-cell id"
              style="display: flex;
                justify-content: flex-end;
                flex: 0 0 50px;
                justify-content: center;
                padding: 0;">
              <span>id</span>
            </div>
            <div
              class="dt-cell date"
              style="display: flex;
                justify-content: flex-end;
                flex: 0 0 200px;">
              <span>date</span>
            </div>
            <div
              class="dt-cell action"
              style="display: flex;
                justify-content: flex-end;
                flex: 0 0 120px;">
              <span>action</span>
            </div>
            <div
              class="dt-cell status"
              style="display: flex;
                justify-content: flex-end;
                flex: 0 0 240px;">
              <span>status</span>
            </div>
            <div
              class="dt-cell owner"
              style="display: flex;
                justify-content: flex-end;
                flex: 0 0 260px;">
              <span>owner</span>
            </div>
          </div>

          <div class="loading-container">
            <div
              v-if="$apollo.queries.searchToolHistory.loading"
              class="loading">
            </div>
          </div>

          <div
            v-if="!$apollo.queries.searchToolHistory.loading"
            class="dt-body"
            style="display: flex;
              flex-direction: column;">
            <div
              v-for="entry in searchToolHistory"
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
                  justify-content: flex-end;
                  flex: 0 0 50px;
                  justify-content: center;
                  padding: 0;
                  display: flex;
                  align-items: center;
                  height: 85px;
                  font-weight: 900; border-right: solid 1px lightgray;">
                <span>{{ entry.tool_snapshot.id }}</span>
              </div>
              <div
                class="dt-cell date"
                style="display: flex;
                  justify-content: flex-end;
                  display: flex;
                  align-items: center;
                  height: 85px;
                  font-weight: 900; flex: 0 0 200px;">
                <span>{{ `${new Date(entry.timestamp).toLocaleDateString('en-US', { timeZone: 'UTC' })} ${new Date(entry.timestamp).toLocaleTimeString('en-US')}` }}</span>
              </div>
              <div
                class="dt-cell action"
                style="display: flex;
                  justify-content: flex-end;
                  flex: 0 0 120px;
                  display: flex;
                  align-items: center;
                  height: 85px;
                  font-weight: 900;">
                <span>{{ entry.tool_action }}</span>
              </div>
              <div
                class="dt-cell status"
                style="display: flex;
                  justify-content: flex-end; flex: 0 0 270px;
                  display: flex;
                  align-items: center;
                  height: 85px;
                  font-weight: 900;">
                <span
                  v-if="entry.previous_tool_snapshot_diff.status"
                  class="previous-snapshot"
                  style="color: gray;">{{ entry.previous_tool_snapshot_diff.status }}</span>
                <i
                  v-if="entry.previous_tool_snapshot_diff.status"
                  class="fas fa-long-arrow-alt-right"
                  style="margin: 0 10px; content: '\f30b'"></i>

                <span>{{ entry.tool_snapshot.status }}</span>

              </div>
              <div
                class="dt-cell owner"
                style="display: flex;
                  justify-content: flex-end;
                  flex: 0 0 260px;
                  display: flex;
                  align-items: center;
                  height: 85px;
                  font-weight: 900;">
                <div v-if="entry.previous_tool_snapshot_diff.owner">
                  <div
                    v-if="entry.previous_tool_snapshot_diff.owner.type === 'USER'"
                    class="owner-entry previous-snapshot"
                    style="color: gray;
                      text-align: center;
                      max-width: 125px;
                      word-break: break-all;">
                    {{ `${entry.previous_tool_snapshot_diff.owner.first_name} ${entry.previous_tool_snapshot_diff.owner.last_name}` }}
                  </div>
                  <div
                    v-if="entry.previous_tool_snapshot_diff.owner.type === 'LOCATION'"
                    class="owner-entry previous-snapshot"
                    style="color: gray;
                      text-align: center;
                      max-width: 125px;
                      word-break: break-all;">
                    <i class="fas fa-map-marker-alt"></i>
                    {{ entry.previous_tool_snapshot_diff.owner.name }}
                  </div>
                </div>

                <i
                  v-if="entry.previous_tool_snapshot_diff.owner"
                  class="fas fa-long-arrow-alt-right"
                  style="margin: 0 10px; content: '\f30b'"></i>

                <div
                  v-if="entry.tool_snapshot.owner.type === 'USER'"
                  class="owner-entry"
                  style="text-align: center;
                    max-width: 125px;
                    word-break: break-all;">
                  {{ `${entry.tool_snapshot.owner.first_name} ${entry.tool_snapshot.owner.last_name}` }}
                </div>
                <div
                  v-if="entry.tool_snapshot.owner.type === 'LOCATION'"
                  class="owner-entry"
                  style="text-align: center;
                    max-width: 125px;
                    word-break: break-all;">
                  {{ entry.tool_snapshot.owner.name }}
                </div>
              </div>
            </div>
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
    searchToolHistory: {
      query: gql`query search($toolHistoryFilter: ToolHistoryFilter) {
        searchToolHistory(toolHistoryFilter: $toolHistoryFilter) {
          id
          tool_snapshot {
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
          timestamp
          previous_tool_snapshot_diff {
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
          tool_action
        }
      }`,
      variables () {
        let options = {}

        if (this.filters) {
          options.toolHistoryFilter = this.filters
        }

        return options
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
      searchToolHistory: [],
      tags: [],
      tagFilters: null,
      dateRange: null,
      isDatepickerShown: false
    }
  },

  computed: {
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

    toggleDatepicker (inputValue, updateValue) {
      updateValue(inputValue, { formatInput: true, hidePopover: this.isDatepickerShown })
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
    .search-bar {
      width: calc(100% - 70px);
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
    padding: 10px;
    min-height: 45px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    z-index: 5;
    display: flex;
    min-height: fit-content;
  }

  .report {
    display: none;
    display: flex;
    height: 100%;
    overflow: auto;
  }

  .export-btn {
    position: absolute;
    right: 30px;
  }

  .print-btn {
    position: absolute;
    right: 30px;
  }
}
</style>
