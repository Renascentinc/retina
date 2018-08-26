<template>
<div class="tool-search-result">
  <div class="main-container">
    <div class="row">
      <span class="tool-name">{{toolName}}</span>
    </div>
    <div class="row">
      <span class="tool-id">{{toolId}}</span>
      <span class="tool-status" :class="[toolStatusClass]">{{tool.status}}</span>
    </div>
    <div class="row">
      <i class="user-icon material-icons">person</i>
      <span class="tool-assignee">{{tool.assignee}}</span>
    </div>
  </div>
  <div class="image-container">
    <img class="tool-image" v-lazy="imageSrc">
  </div>
</div>
</div>
</template>

<script>
export default {
  name: 'tool-search-result',

  props: [
    'tool'
  ],

  computed: {
    imageSrc() {
      return this.tool.imgSrc || 'https://vuejs.org/images/logo.png'
    },
    toolId() {
      return `#${this.tool.id}`
    },
    toolName() {
      return `${this.tool.brand} ${this.tool.type}`
    },
    toolStatusClass() {
      return this.tool.status.split(' ').join('-');
    }
  }
}
</script>

<style lang="scss">
  @import '../styles/variables';
  $tool-search-result-border-radius: 5px;

  .tool-search-result {
    display: flex;
    height: 75px;
    min-height: 75px;
    margin: 10px 20px;
    border-radius: $tool-search-result-border-radius;
    text-transform: capitalize;
    background-color: #fff;

    .main-container {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      margin: 5px;

      .row {
        display: flex;
        align-items: center;
        flex: 1 1 auto;

        .tool-id {
          margin-right: 10px;
        }

        .tool-status {
          text-transform: none;

          &.available {
            color: $status-available;
          }

          &.in-use {
            color: $status-in-use;
          }

          &.maintenance {
            color: $status-maintenance;
          }

          &.out-of-service {
            color: $status-out-of-service;
          }
        }
      }
    }

    .image-container {
      flex: 0 0 75px;
      height: 100%;
      background-color: $background-dark-gray;
      border-top-right-radius: $tool-search-result-border-radius;
      border-bottom-right-radius: $tool-search-result-border-radius;

      .tool-image {
        height: 100%;
        width: 100%;
      }
    }
  }
</style>
