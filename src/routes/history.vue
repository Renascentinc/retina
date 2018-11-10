<template>
  <div class="page history-page">
    <div class="search-bar">
      <history-search-input :update-tags="updateTagFilters"></history-search-input>
      <v-date-picker
        v-model="dateRange"
        :input-props="{ readonly: true }"
        :attributes="[{ popover: { visibility: 'hidden' } }]"
        :max-date="new Date()"
        :is-double-paned="true"
        popover-direction="bottom"
        popover-align="right"
        mode="range">

        <button
          slot-scope="{ inputValue, updateValue }"
          class="fas fa-calendar open-datepicker">
        </button>
      </v-date-picker>
    </div>
    <div class="report">
      <div id="export-table">
        <div class="dt-head">
          <div class="dt-cell id">
            <span>id</span>
          </div>
          <div class="dt-cell date">
            <span>date</span>
          </div>
          <div class="dt-cell action">
            <span>action</span>
          </div>
          <div class="dt-cell status">
            <span>status</span>
          </div>
          <div class="dt-cell owner">
            <span>owner</span>
          </div>
        </div>

        <div class="dt-body">
          <div
            v-for="entry in searchToolHistory"
            :key="entry.id"
            class="dt-row">
            <div class="dt-cell id">
              <span>{{ entry.tool_snapshot.id }}</span>
            </div>
            <div class="dt-cell date">
              <span>{{ `${new Date(entry.timestamp).toLocaleDateString('en-US', { timeZone: 'UTC' })} ${new Date(entry.timestamp).toLocaleTimeString('en-US')}` }}</span>
            </div>
            <div class="dt-cell action">
              <span>{{ entry.tool_action }}</span>
            </div>
            <div class="dt-cell status">
              <span
                v-if="entry.previous_tool_snapshot_diff.status"
                class="previous-snapshot">{{ entry.previous_tool_snapshot_diff.status }}</span>
              <i
                v-if="entry.previous_tool_snapshot_diff.status"
                class="fas fa-long-arrow-alt-right"></i>

              <span>{{ entry.tool_snapshot.status }}</span>

            </div>
            <div class="dt-cell owner">
              <div v-if="entry.previous_tool_snapshot_diff.owner">
                <div
                  v-if="entry.previous_tool_snapshot_diff.owner.type === 'USER'"
                  class="owner-entry previous-snapshot">
                  <!-- <avatar :username="`${entry.previous_tool_snapshot_diff.owner.first_name} ${entry.previous_tool_snapshot_diff.owner.last_name}`"></avatar> -->
                  {{ `${entry.previous_tool_snapshot_diff.owner.first_name} ${entry.previous_tool_snapshot_diff.owner.last_name}` }}
                </div>
                <div
                  v-if="entry.previous_tool_snapshot_diff.owner.type === 'LOCATION'"
                  class="owner-entry previous-snapshot">
                  <i class="fas fa-map-marker-alt"></i>
                  {{ entry.previous_tool_snapshot_diff.owner.name }}
                </div>
              </div>

              <i
                v-if="entry.previous_tool_snapshot_diff.owner"
                class="fas fa-long-arrow-alt-right"></i>

              <div
                v-if="entry.tool_snapshot.owner.type === 'USER'"
                class="owner-entry">
                <!-- <avatar :username="`${entry.tool_snapshot.owner.first_name} ${entry.tool_snapshot.owner.last_name}`"></avatar> -->
                {{ `${entry.tool_snapshot.owner.first_name} ${entry.tool_snapshot.owner.last_name}` }}
              </div>
              <div
                v-if="entry.tool_snapshot.owner.type === 'LOCATION'"
                class="owner-entry">
                <!-- <i class="fas fa-map-marker-alt"></i> -->
                {{ entry.tool_snapshot.owner.name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <fab
        :on-click="printTable"
        class="print-btn"
        icon-class="fa-print">
      </fab>

      <fab
        :on-click="exportTable"
        class="export-btn"
        icon-class="fa-file-download">
      </fab>
    </div>
  </div>
</template>

<script>
import HistorySearchInput from '../components/history-search-input'
import Avatar from 'vue-avatar'
import Fab from '../components/fab'
import html2pdf from 'html2pdf.js'
import gql from 'graphql-tag'

export default {
  name: 'History',
  components: {
    HistorySearchInput,
    Avatar,
    Fab
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
      tagFilters: null,
      dateRange: null
    }
  },

  computed: {
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
      window.console.log(this.searchToolHistory)
    },

    updateTagFilters (filters = []) {
      let newFilters = filters.length ? {} : null
      filters.forEach(filter => {
        let key = this.filterMap[filter.type]

        if (!newFilters[key]) {
          newFilters[key] = [filter.id]
        } else {
          newFilters[key].push(filter.id)
        }
      })
      this.tagFilters = newFilters
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.history-page {
  display: flex;
  flex-direction: column;
  max-width: 100vw;

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
  }

  .report {
    display: none;
    background-color: $background-light-gray;
    display: flex;
    height: 100%;
    overflow: auto;

    .export-btn {
      position: absolute;
      bottom: 80px;
      right: 50px;
    }

    .print-btn {
      position: absolute;
      bottom: 80px;
      right: 120px;
    }
  }
}

#export-table {
  width: 980px;
  min-width: 980px;
  padding: 20px;

  .dt-cell {
    display: flex;
    justify-content: flex-end;

    &.id {
      flex: 0 0 50px;
      justify-content: center;
      padding: 0;
    }

    &.action {
      flex: 0 0 100px;
    }

    &.status {
      flex: 0 0 240px;
    }

    &.owner {
      flex: 0 0 280px;
    }
  }

  .fa-long-arrow-alt-right {
    margin: 0 10px;
  }

  .previous-snapshot {
    color: gray;
  }

  .owner-entry {
    text-align: center;
    max-width: 125px;
    word-break: break-all;
  }

  .dt-head {
    display: flex;
    border-radius: 3px;
    background-color: $renascent-dark-gray;
    font-size: 20px;
    height: 40px;
    align-items: center;
    color: white;
    text-align: left;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
    font-weight: 900;
  }

  .dt-body {
    display: flex;
    flex-direction: column;

    .dt-row {
      display: flex;
      border-radius: 3px;
      border-bottom: solid 1px lightgray;
      background-color: white;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);

      .dt-cell {
        display: flex;
        align-items: center;
        height: 85px;
        font-weight: 900;

        &:first-child {
          border-right: solid 1px lightgray;
        }

        .owner-entry {
          display: flex;
          align-items: center;
        }
      }
    }
  }

  .dt-cell {
    flex: 0 0 200px;
    padding-left: 16px;
  }

  .vue-avatar--wrapper {
    background-color: $background-light-gray !important;
    color: $renascent-red !important;
    font-weight: 700 !important;
    width: 30px !important;
    height: 30px !important;
    font-size: 15px !important;
  }
}
</style>
