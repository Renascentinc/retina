<template>
  <div
    class="search-result"
    :class="configItem.sanctioned ? 'sanctioned' : 'unsanctioned'">
    <div
      class="element-container">
      <i
        class="fas fa-pen edit-icon"
        v-if="!editing"
        @click="startEditing">
      </i>
      <i
        class="fas fa-save save-icon"
        v-if="editing"
        @click="save">
      </i>
      <input
        v-if="editing"
        :placeholder="configItem.name"
        v-model="changedName"/>
      <i
        class="fas fa-times cancel-icon"
        v-if="editing"
        @click="cancelEdit">
      </i>
      <div
        class="main-container"
        @click="startEditing">
        <div
          class="row"
          v-if="!editing">
          <span class="title">{{ configItem.name }}</span>
        </div>
        <div
          class="row"
          v-if="!editing">
          <span class="subtitle">{{ configItem.sanctioned ? 'CONFIRMED' : 'NOT CONFIRMED' }}</span>
        </div>
      </div>
      <div
        class="actions"
        v-if="!editing">
        <div
          class="action-group"
          v-if="configItem.sanctioned"
          @click="toggleSanctioned">
          <fab
            icon-class="fa-thumbs-down"
            :on-click="toggleSanctioned">
          </fab>
          REJECT
        </div>

        <div
          class="action-group"
          v-if="!configItem.sanctioned"
          @click="toggleSanctioned">
          <fab
            icon-class="fa-thumbs-up"
            :on-click="toggleSanctioned">
          </fab>
          CONFIRM
        </div>

        <div class="action-group">
          <fab
            icon-class="fa-times"
            :on-click="onDelete">
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

  data () {
    return {
      editing: false,
      changedName: ''
    }
  },

  methods: {
    save () {
      var changedConfig = {
        id: this.$props.configItem.id,
        name: this.changedName,
        sanctioned: this.$props.configItem.sanctioned
      }
      console.log(changedConfig)
      this.$props.onSave(changedConfig)
      this.cancelEdit()
    },

    cancelEdit () {
      this.editing = false
      this.changedName = ''
    },

    startEditing () {
      this.editing = true
    },

    toggleSanctioned () {
      this.$props.onSanctionToggle(this.$props.configItem)
    }
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

    onSave: {
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

    .save-icon, .cancel-icon {
      color: $renascent-red;
      font-size: 30px;
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
