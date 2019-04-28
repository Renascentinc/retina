<template>
  <div class="row-container">
    <div
      class="row"
      @click="selectResult()"
    >
      <div
        :class="isDetailResult ? 'caret-box' : ''"
        class="dt-cell id"
        @click="toggleDetails"
      >
        <span
          v-if="!isDetailResult"
        >
          {{ entry.tool.id }}
        </span>
        <i
          v-if="isDetailResult"
          :class="showingDetails ? 'down' : 'right'"
          class="fas fa-angle-right"
        >
        </i>
      </div>
      <div class="dt-cell name">
        <span>{{ `${ entry.tool.brand.name } ${ entry.tool.type.name }` }}</span>
      </div>
      <div class="dt-cell date">
        <span>{{ new Date(entry.metadata.timestamp).toLocaleDateString('en-US') }}</span>
      </div>
      <div class="dt-cell action">
        <span>{{ entry.metadata.tool_action.toLowerCase() }}</span>
      </div>
    </div>
    <transition name="history-detail">
      <div
        v-if="showingDetails"
        class="details"
      >
        <div class="detail-row">
          <span class="label">
            TIME
          </span>
          <span class="value">
            {{ new Date(entry.metadata.timestamp).toLocaleDateString('en-US') + ' ' + new Date(entry.metadata.timestamp).toLocaleTimeString('en-US') }}
          </span>
        </div>
        <div class="detail-row">
          <span class="label">
            DONE BY
          </span>
          <span class="value">
            {{ actorName }}
          </span>
        </div>
        <div class="detail-row">
          <span class="label">
            STATUS
          </span>
          <span
            v-if="!statusDiff"
            class="value"
          >
            {{ formatToLower(status) }}
          </span>
          <span
            v-if="statusDiff"
            class="value"
          >
            <span class="lhs">
              {{ formatToLower(status.lhs) }}
            </span>
            <i class="fas fa-long-arrow-alt-right"></i>
            <span class="rhs">
              {{ formatToLower(status.rhs) }}
            </span>
          </span>
        </div>
        <div class="detail-row">
          <span class="label">
            OWNER
          </span>
          <span
            v-if="!ownerDiff"
            class="value"
          >
            {{ formatToLower(owner) }}
          </span>
          <span
            v-if="ownerDiff"
            class="value"
          >
            <span class="lhs">
              {{ formatToLower(owner.lhs) }}
            </span>
            <i class="fas fa-long-arrow-alt-right"></i>
            <span class="rhs">
              {{ formatToLower(owner.rhs) }}
            </span>
          </span>
        </div>

        <div
          v-for="change in (diff || []).filter(d => !!d)"
          :key="change.path[0]"
          class="detail-row diff-row"
        >
          <span class="label">
            {{ formatToUpper(change.path[0]) }}
          </span>
          <span class="value">
            <span class="lhs">
              {{ change.lhs || '-' }}
            </span>
            <i class="fas fa-long-arrow-alt-right"></i>
            <span class="rhs">
              {{ change.rhs || '-' }}
            </span>
          </span>
        </div>
        <div
          v-if="metadata.action_note !== null"
          class="detail-row diff-row"
        >
          <span class="label">
            NOTE
          </span>
          <span class="value">
            {{ metadata.action_note }}
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import DeepDiff from 'deep-diff'

export default {
  name: 'HistorySearchResult',

  props: {
    entry: {
      type: Object,
      required: true
    },
    selectTool: {
      type: Function,
      required: true
    },
    isDetailResult: {
      type: Boolean,
      required: true
    }
  },

  data () {
    return {
      details: false,
      currentSnapshot: {},
      previousSnapshot: {},
      metadata: {},
      statusDiff: null,
      ownerDiff: null,
      diff: null
    }
  },

  computed: {
    diffMap () {
      var diffMap = {}

      return diffMap
    },

    showingDetails () {
      return this.details && this.$props.isDetailResult
    },

    loadingDetail () {
      return this.currentSnapshot === null
    },

    status () {
      return this.statusDiff || this.$props.entry.tool.status
    },

    owner () {
      return this.ownerDiff || this.ownerName
    },

    actorName () {
      if (this.currentSnapshot) {
        return '' || `${this.metadata.actor.first_name} ${this.metadata.actor.last_name}`
      }

      return ''
    },

    ownerName () {
      if (this.currentSnapshot) {
        if (this.currentSnapshot.owner.type === 'LOCATION') {
          return this.currentSnapshot.owner.name
        }

        if (this.currentSnapshot.owner.type === 'USER') {
          return `${this.currentSnapshot.owner.first_name} ${this.currentSnapshot.owner.last_name}`
        }
      }

      return ''
    }

  },

  methods: {
    formatToUpper (tstring) {
      return tstring.replace(/_/g, ' ').toUpperCase()
    },

    formatToLower (tstring) {
      return tstring.replace(/_/g, ' ').toLowerCase()
    },

    selectResult () {
      this.$props.selectTool(this.$props.entry.tool.id)
    },

    toggleDetails () {
      if (!this.showingDetails) {
        this.showDetails()
      } else {
        this.details = false
      }
    },

    showDetails () {
      this.$apollo.query({
        query: gql`
          query getToolSnapshot($id: ID!) {
            getToolSnapshot(tool_snapshot_id: $id) {
              id
              metadata {
                action_note
              }
              tool {
                id
                status
                photo
                model_number
                serial_number
                brand {
                  id
                  name
                }
                type {
                  id
                  name
                }
                purchased_from {
                  id
                  name
                }
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
                date_purchased
                price
                year
              }
              metadata {
                actor {
                  id
                  first_name
                  last_name
                }
              }
              previous_tool_snapshot {
                tool {
                  id
                  status
                  model_number
                  serial_number
                  brand {
                    id
                    name
                  }
                  type {
                    id
                    name
                  }
                  purchased_from {
                    id
                    name
                  }
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
                  date_purchased
                  price
                  year
                }
              }
            }
          }
        `,
        variables: {
          id: this.$props.entry.id
        }
      }).then((result) => {
        this.currentSnapshot = result.data.getToolSnapshot.tool
        this.metadata = result.data.getToolSnapshot.metadata
        this.previousSnapshot = result.data.getToolSnapshot.previous_tool_snapshot && result.data.getToolSnapshot.previous_tool_snapshot.tool
        this.diff = this.findDiff(this.previousSnapshot, this.currentSnapshot)
        this.details = true
      })
    },

    findDiff (previous, current) {
      if (previous !== null) {
        previous.owner.name = previous.owner.name || (previous.owner.first_name + ' ' + previous.owner.last_name)
        current.owner.name = current.owner.name || (current.owner.first_name + ' ' + current.owner.last_name)

        let diff = DeepDiff.diff(previous, current)

        let finalDiff = []

        if (diff) {
          diff.forEach((change) => {
            if (change.path.indexOf('id') < 0 &&
                change.path.indexOf('first_name') < 0 &&
                change.path.indexOf('last_name') < 0 &&
                change.path.indexOf('status') < 0 &&
                change.path.indexOf('owner') < 0 &&
                change.path.indexOf('photo') < 0) {
              if (change.path.indexOf('price') >= 0) {
                finalDiff.push({
                  lhs: change.lhs !== null ? `$${(change.lhs / 100).toFixed(2)}` : null,
                  rhs: change.rhs !== null ? `$${(change.rhs / 100).toFixed(2)}` : null,
                  path: change.path
                })
              } else if (change.path.indexOf('date_purchased') >= 0) {
                finalDiff.push({
                  lhs: change.lhs !== null ? new Date(change.lhs).toLocaleDateString('en-US') : null,
                  rhs: change.rhs !== null ? new Date(change.rhs).toLocaleDateString('en-US') : null,
                  path: change.path
                })
              } else {
                finalDiff.push(change)
              }
            }

            if (change.path.indexOf('owner') >= 0 &&
                change.path.indexOf('first_name') < 0 &&
                change.path.indexOf('last_name') < 0 &&
                change.path.indexOf('type') < 0 &&
                change.path.indexOf('__typename') < 0) {
              this.ownerDiff = change
            }

            if (change.path.indexOf('status') >= 0) {
              this.statusDiff = change
            }
          })
        }

        return finalDiff
      } else {
        return null
      }
    }
  }
}
</script>

<style lang="scss">
@import "../styles/variables";

.row-container {
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  background-color: white;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  overflow: hidden;
  margin-bottom: 1px;

  .row {
    display: flex;
    height: 50px;

    .fas {
      font-size: 20px;
      color: $renascent-red;
      transition: transform 0.1s;
    }

    .right {
      transform: rotate(0deg);
    }

    .down {
      transform: rotate(90deg);
    }

    .caret-box {
      cursor: pointer;

      &:active {
        background-color: $renascent-red !important;
        opacity: 0.6;
        * {
          color: white !important;
        }
      }
    }

    .id {
      display: flex;
      flex: 0 0 40px;
      font-size: 12px;
      justify-content: center;
      padding: 0;
      display: flex;
      align-items: center;
      font-weight: 900;
      border-right: solid 1px lightgray;
    }

    .name {
      display: flex;
      justify-content: flex-start;
      margin-left: 10px;
      display: flex;
      align-items: center;
      flex-direction: row;
      font-weight: 600;
      flex: 0 0 calc(33% - 16px);
    }

    .date {
      display: flex;
      justify-content: center;
      display: flex;
      align-items: center;
      font-weight: 600;
      flex: 0 0 calc(33% - 16px);
    }

    .action {
      display: flex;
      justify-content: center;
      flex: 0 0 calc(33% - 16px);
      display: flex;
      align-items: center;
      font-weight: 600;
      text-transform: capitalize;
    }
  }

  .details {
    padding-left: 41px;
    background-color: #f5f5f5;
    border-top: solid 1px lightgray;
    display: flex;
    flex-direction: column;
    padding-top: 10px;
    padding-bottom: 10px;

    .extended-fab {
      border-radius: 5px;
      margin-left: auto !important;
      margin-right: auto !important;
      height: 40px;
      min-width: 158px;
      margin-top: 7px;
      margin-right: 10px;
    }

    .diff-row {
      border-top: solid 1px lightgray;
    }

    .detail-row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding-right: 5px;

      .label {
        color: $renascent-red;
        opacity: 0.6;
        font-weight: 800;
        width: 30%;
        text-align: right;
        padding-right: 10px;
      }

      .value {
        font-weight: 600;
        width: 70%;
        color: $renascent-dark-gray;
        text-transform: capitalize;

        .lhs {
          font-weight: 500;
          color: $background-dark-gray;
        }
      }
    }
  }
}
</style>
