<template>
  <div class="tool-search-result">
    <div
      class="main-container"
      @click="onClick">
      <div class="row">
        <span class="tool-name">{{ name }}</span>
      </div>
      <div class="row">
        <span class="tool-id">{{ id }}</span>
        <span
          :class="[statusClass]"
          class="tool-status">{{ status }}</span>
      </div>
      <div class="row">
        <i class="fas fa-user user-icon"/>
        <span class="tool-assignee">{{ assignee }}</span>
      </div>
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
      if (this.tool.location.name) {
        return this.tool.location.name
      }
      return `${this.tool.user.first_name} ${this.tool.user.last_name}`
    }
  },

  methods: {
    onClick () {
      this.onSelect(this.tool.id)
    }
  }
}
</script>

<style lang="scss">
  @import '../styles/variables';
  $tool-search-result-border-radius: 3px;

  .tool-search-result {
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
          margin-right: 10px;
          font-weight: 700;
          font-size: 15px;
        }

        .tool-status {
          text-transform: none;
        }

        .user-icon {
          font-size: 15px;
          margin-right: 5px;
        }
      }
    }
  }
</style>
