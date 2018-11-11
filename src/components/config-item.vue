<template>
  <div
    class="search-result"
    :class="configItem.sanctioned ? 'sanctioned' : 'unsanctioned'">
    <div
      class="element-container">
      <i class="fas fa-pen edit-icon"></i>
      <div
        class="main-container">
        <div class="row">
          <span class="title">{{ configItem.name }}</span>
        </div>
        <div class="row">
          <span class="subtitle">{{ configItem.sanctioned ? 'CONFIRMED' : 'NOT CONFIRMED' }}</span>
        </div>
      </div>
      <div class="actions">
        <div
          class="action-group"
          v-if="configItem.sanctioned">
          <fab
            icon-class="fa-thumbs-down"
            :on-click="() => {}">
          </fab>
          REJECT
        </div>

        <div
          class="action-group"
          v-if="!configItem.sanctioned">
          <fab
            icon-class="fa-thumbs-up"
            :on-click="() => {}">
          </fab>
          CONFIRM
        </div>

        <div class="action-group">
          <fab
            icon-class="fa-times"
            :on-click="() => {}">
          </fab>
          DELETE
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Fab from '../components/fab'

export default {
  name: 'ConfigItem',

  components: {
    Fab
  },

  props: {
    configItem: {
      required: true,
      type: Object,
    },

    onDelete: {
      required: true,
      type: Function
    },

    onSanctionToggle: {
      required: true,
      type: Function
    },

    onEdit: {
      required: true,
      type: Function
    }
  }
}
</script>

<style lang="scss">
  @import '../styles/variables';
  @import '../styles/search-result';

  .unsanctioned {
    background-color: $renascent-red;
    color: white;

    .edit-icon {
      color: white !important;
    }

    .action-group {
      color: white !important;

      .fab {
        color: $renascent-red;
        background-color: white;
      }
    }
  }

  .search-result {
    .edit-icon {
      color: $dark-avatar;
    }

    .main-container {
      flex: 1 1 50%;
      overflow: hidden;
      text-overflow: ellipsis;

      span {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .actions {
      display: flex;
      flex-direction: row;
      flex: 1 1 50%;
      justify-content: space-around;
      height: 100%;

      .action-group {
        font-size: 10px;
        font-weight: 600;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        color: $renascent-dark-gray;
        padding-top: 5px;
        padding-bottom: 5px;

        .fab {
          height: 32px;
          width: 32px;
          font-size: 16px;
          box-shadow: none;
        }
      }
    }
  }
</style>
