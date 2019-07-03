<template>
  <div class="search-result">
    <div
      class="main-container"
      @click="onClick"
    >
      <div class="row">
        <span class="title">
          {{ tool.name }}
        </span>
      </div>
      <div class="row">
        <span class="subtitle">
          {{ tool.formattedId }}
        </span>
        <span
          :class="tool.statusClass"
          class="tool-status"
        >
          {{ tool.formattedStatus }}
        </span>
      </div>
      <div class="row">
        <i
          :class="tool.owner.iconClass"
          class="fas user-icon"
        />

        <span class="tool-assignee">
          {{ tool.owner.name }}
        </span>
      </div>
    </div>
    <transition name="fade">
      <div
        v-if="showSelect"
        class="tool-selection-container"
      >
        <button
          :class="{ 'fa-check': selected }"
          class="fas checkbox"
          @click="toggleSelect"
        >
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'ToolSearchResult',

  props: {
    tool: {
      type: Object,
      required: true
    },
    onSelect: {
      type: Function,
      required: false,
      default: () => {}
    },
    showSelect: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    ...mapState('tools', [
      'selectedToolsMap'
    ]),

    selected () {
      return this.selectedToolsMap[this.tool.id]
    }
  },

  methods: {
    ...mapMutations('tools', [
      'toggleToolSelection'
    ]),

    onClick () {
      this.onSelect(this.tool.id)
    },

    toggleSelect () {
      this.toggleToolSelection(this.tool.id)
    }
  }
}
</script>

<style lang="scss">

@import "../styles/search-result";

.tool-status {
  text-transform: none;
  font-weight: bold;
}

.user-icon {
  font-size: 15px;
  margin-right: 5px;
}

.tool-assignee {
  font-weight: 700;
  white-space: nowrap;
}

.tool-selection-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 100px;

  .checkbox {
    height: 37px;
    width: 37px;
    border: 2px solid $renascent-dark-gray;
    color: $renascent-dark-gray;
    border-radius: 3px;
    padding: 0;
    font-size: 27px;
    color: white;

    &.fa-check {
      background-color: $renascent-dark-gray;
    }
  }
}
</style>
