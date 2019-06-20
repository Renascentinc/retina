<template>
  <div class="search-result">
    <div
      class="main-container"
      @click="onClick"
    >
      <div class="row">
        <span class="title">
          {{ name }}
        </span>
      </div>
      <div class="row">
        <span class="subtitle">
          {{ id }}
        </span>
        <span
          :class="statusClass"
          class="tool-status"
        >
          {{ status }}
        </span>
      </div>
      <div class="row">
        <i
          :class="assigneeIcon"
          class="fas user-icon"
        >
        </i>

        <span class="tool-assignee">
          {{ assignee }}
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
import { mapState } from 'vuex'

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
    ...mapState([
      'selectedToolsMap'
    ]),

    id () {
      return `#${this.tool.id}`
    },

    name () {
      return `${this.tool.brand.name} ${this.tool.type.name}`
    },

    statusClass () {
      return this.tool.status
        .split('_')
        .join('-')
        .toLowerCase()
    },

    status () {
      return this.tool.status
        .split('_')
        .join(' ')
        .toLowerCase()
    },

    assignee () {
      return this.tool.owner.isUser || this.tool.owner.type === 'USER' ? `${this.tool.owner.first_name} ${this.tool.owner.last_name}` : this.tool.owner.name
    },

    assigneeIcon () {
      return this.tool.owner.isUser || this.tool.owner.type === 'USER' ? 'fa-user' : 'fa-map-marker-alt'
    },

    selected () {
      return this.selectedToolsMap[this.tool.id]
    }
  },

  methods: {
    onClick () {
      this.onSelect(this.tool.id)
    },

    toggleSelect () {
      this.$store.commit('toggleToolSelection', this.tool.id)
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
