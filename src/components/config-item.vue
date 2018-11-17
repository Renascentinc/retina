<template>
  <div
    :class="configItem.sanctioned ? 'sanctioned' : 'unsanctioned'"
    class="search-result">
    <div
      class="element-container">
      <i
        v-if="!editing"
        class="fas fa-pen edit-icon"
        @click="startEditing">
      </i>
      <i
        v-if="editing"
        class="fas fa-save save-icon"
        @click="save">
      </i>
      <input
        v-if="editing"
        v-model="changedName"/>
      <i
        v-if="editing"
        class="fas fa-times cancel-icon"
        @click="cancelEdit">
      </i>
      <div
        v-if="!editing"
        class="main-container"
        @click="startEditing">
        <div
          v-if="!editing"
          class="row">
          <span class="title">{{ configItem.name }}</span>
        </div>
        <div
          v-if="!editing"
          class="row">
          <span class="subtitle">{{ configItem.sanctioned ? 'CONFIRMED' : 'NOT CONFIRMED' }}</span>
        </div>
      </div>
      <div
        v-if="!editing"
        class="actions">
        <div
          v-if="configItem.sanctioned"
          class="action-group"
          @click="toggleSanctioned">
          <fab
            :on-click="toggleSanctioned"
            icon-class="fa-thumbs-down">
          </fab>
          REJECT
        </div>

        <div
          v-if="!configItem.sanctioned"
          class="action-group"
          @click="toggleSanctioned">
          <fab
            :on-click="toggleSanctioned"
            icon-class="fa-thumbs-up">
          </fab>
          CONFIRM
        </div>

        <div class="action-group">
          <fab
            :on-click="deleteConfig"
            icon-class="fa-times">
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
      type: Object
    },

    onDelete: {
      required: true,
      type: Function
    },

    onSanctionToggle: {
      required: true,
      type: Function
    },

    onSave: {
      required: true,
      type: Function
    }
  },

  data () {
    return {
      editing: false,
      changedName: ''
    }
  },

  methods: {
    deleteConfig () {
      this.$props.onDelete(this.$props.configItem)
    },

    save () {
      if (this.$props.configItem.name !== this.changedName) {
        var changedConfig = {
          id: this.$props.configItem.id,
          name: this.changedName,
          sanctioned: this.$props.configItem.sanctioned
        }

        this.$props.onSave(changedConfig)
      }

      this.cancelEdit()
    },

    cancelEdit () {
      this.editing = false
      this.changedName = ''
    },

    startEditing () {
      this.changedName = this.$props.configItem.name
      this.editing = true
    },

    toggleSanctioned () {
      this.$props.onSanctionToggle(this.$props.configItem)
    }
  }
}
</script>

<style lang="scss">
  @import '../styles/variables';
  @import '../styles/search-result';

  .search-result {
    &.sanctioned {
      .save-icon, .cancel-icon {
        color: $renascent-red;
        font-size: 30px;
      }
    }

    &.unsanctioned {
      background-color: $renascent-red;
      color: white;

      .edit-icon {
        color: white !important;
      }

      .save-icon, .cancel-icon {
        color: white;
        font-size: 30px;
      }

      .action-group {
        color: white !important;

        .fab {
          color: $renascent-red;
          background-color: white;
        }
      }
    }

    .element-container {
      padding-right: 10px;
    }

    input {
      border-radius: 3px;
      border: solid $disabled-gray 1px;
      text-indent: 3px;
      margin-left: 10px;
      margin-right: 10px;
      height: 40px;
      margin-top: 10px;
      margin-bottom: 10px;
      width: 80%;
      font-size: 18px;
      font-weight: 600;
    }

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
      flex: 0 0 50%;
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
        width: 50px;

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
