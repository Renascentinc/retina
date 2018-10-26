<template>
  <div class="search-result">
    <div
      class="main-container"
      @click="onClick">
      <div class="row">
        <span class="title">{{ name }}</span>
      </div>
      <div class="row">
        <span class="subtitle">{{ id }}</span>
        <span
          :class="statusClass"
          class="tool-status">
          {{ status }}
        </span>
      </div>
      <div class="row">
        <i
          :class="assigneeIcon"
          class="fas user-icon">
        </i>

        <span class="tool-assignee">{{ assignee }}</span>
      </div>
    </div>
    <div class="tool-selection-container">
      <transition>
        <button
          v-if="showSelect"
          :class="{ 'fa-check': selected }"
          class="fas checkbox"
          @click="toggleSelect">
        </button>
      </transition>
    </div>
  </div>
</template>

<script>
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
      return this.tool.owner.type === 'USER' ? `${this.tool.owner.first_name} ${this.tool.owner.last_name}` : this.tool.owner.name
    },

    assigneeIcon () {
      return this.tool.owner.type === 'USER' ? 'fa-user' : 'fa-map-marker-alt'
    },

    selected () {
      return this.$store.state.selectedToolsMap[this.tool.id]
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
@import "../styles/variables";
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
}

.tool-selection-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 100px;

  button {
    height: 37px;
    width: 37px;
    background-color: $renascent-dark-gray;
    border-radius: 3px;
    padding: 0;
    font-size: 27px;
    color: white;
  }
}
</style>
