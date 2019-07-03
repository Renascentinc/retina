<template>
  <div class="row-container">
    <div
      class="row"
      @click="() => selectTool(entry.currentSnapshot.id)"
    >
      <div
        :class="isDetailResult ? 'caret-box' : ''"
        class="dt-cell id"
        @click="toggleDetails"
      >
        <span
          v-if="!isDetailResult"
        >
          {{ entry.currentSnapshot.id }}
        </span>
        <i
          v-if="isDetailResult"
          :class="showingDetails ? 'down' : 'right'"
          class="fas fa-angle-right"
        >
        </i>
      </div>
      <div class="dt-cell name">
        <span>{{ `${entry.currentSnapshot.brand.name} ${entry.currentSnapshot.type.name}` }}</span>
      </div>
      <div class="dt-cell date">
        <span>{{ entry.metadata.formattedTimeStamp }}</span>
      </div>
      <div class="dt-cell action">
        <span>{{ entry.metadata.formattedToolAction }}</span>
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
            {{ entry.metadata.formattedTimeStamp }}
          </span>
        </div>
        <div class="detail-row">
          <span class="label">
            DONE BY
          </span>
          <span class="value">
            {{ entry.metadata.actor.name }}
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
            {{ status }}
          </span>
          <span
            v-if="statusDiff"
            class="value"
          >
            <span class="lhs">
              {{ status.lhs }}
            </span>
            <i class="fas fa-long-arrow-alt-right"></i>
            <span class="rhs">
              {{ status.rhs }}
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
            {{ owner }}
          </span>
          <span
            v-if="ownerDiff"
            class="value"
          >
            <span class="lhs">
              {{ owner.lhs }}
            </span>
            <i class="fas fa-long-arrow-alt-right"></i>
            <span class="rhs">
              {{ owner.rhs }}
            </span>
          </span>
        </div>

        <div
          v-for="change in diff"
          :key="change.path[0]"
          class="detail-row diff-row"
        >
          <span class="label">
            {{ change.path[0] }}
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
          v-if="entry.metadata.action_note !== null"
          class="detail-row diff-row"
        >
          <span class="label">
            NOTE
          </span>
          <span class="value">
            {{ entry.metadata.action_note }}
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
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
      statusDiff: null,
      ownerDiff: null
    }
  },

  computed: {
    showingDetails () {
      return this.details && this.isDetailResult
    },

    status () {
      return this.statusDiff || this.entry.currentSnapshot.status
    },

    owner () {
      return this.ownerDiff || this.entry.currentSnapshot.owner.name
    }
  },

  methods: {
    toggleDetails () {
      this.details = !this.details
    }
  }
}
</script>

<style lang="scss">

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
