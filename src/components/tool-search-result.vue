<template>
  <div class="tool-search-result">
    <div
      class="main-container"
      @click="onClick">
      <div class="row">
        <span class="tool-name">{{ name }}</span>
      </div>
      <div class="row">
        <span class="tool-id">
          {{ id }}
        </span>
        <span
          :class="statusClass"
          class="tool-status">
          {{ status }}
        </span>
      </div>
      <div class="row">
        <i
          :class="assigneeIcon"
          class="fas user-icon"/>

        <span class="tool-assignee">{{ assignee }}</span>
      </div>
    </div>
    <div class="tool-selection-container">
      <transition>
        <button
          v-if="showSelect"
          :class="{ 'fa-check': selected }"
          class="fas checkbox"
          @click="toggleSelect"/>
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
      required: true
    },
    showSelect: {
      type: Boolean,
      required: true
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
      return this.tool.status.split('_').join('-').toLowerCase()
    },

    status () {
      return this.tool.status.split('_').join(' ').toLowerCase()
    },

    assignee () {
      if (this.tool.location) {
        return this.tool.location.name
      }
      return `${this.tool.user.first_name} ${this.tool.user.last_name}`
    },

    assigneeIcon () {
      if (this.tool.location) {
        return 'fa-map-marker-alt'
      }

      return 'fa-user'
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
  @import '../styles/variables';
  $tool-search-result-border-radius: 3px;

  .tool-search-result {
    cursor: pointer;
    display: flex;
    height: 75px;
    min-height: 75px;
    margin: 5px 10px;
    border-radius: $tool-search-result-border-radius;
    text-transform: capitalize;
    background-color: #fff;

    .main-container {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      margin: 5px;
      padding-left: 5px;

      .row {
        display: flex;
        align-items: center;
        flex: 1 1 auto;

        .tool-name {
          font-weight: 900;
        }

        .tool-id {
          margin-right: 8px;
          font-weight: 900;
          font-size: 15px;
        }

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
      }
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
  }
</style>
