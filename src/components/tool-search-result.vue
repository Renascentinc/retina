<template>
  <div class="tool-search-result">
    <div
      :click="onClick"
      class="main-container">
      <div class="row">
        <span class="tool-name">{{ toolName }}</span>
      </div>
      <div class="row">
        <span class="tool-id">{{ toolId }}</span>
        <span
          :class="[toolStatusClass]"
          class="tool-status">{{ tool.status }}</span>
      </div>
      <div class="row">
        <i class="user-icon material-icons">person</i>
        <span class="tool-assignee">{{ tool.assignee }}</span>
      </div>
    </div>
  <!-- <div class="image-container">
    <img class="tool-image" v-lazy="imageSrc">
  </div> -->
  </div>
</div>
</template>

<script>
export default {
  name: 'ToolSearchResult',

  props: [
    'tool'
  ],

  computed: {
    imageSrc () {
      return this.tool.imgSrc || 'https://vuejs.org/images/logo.png'
    },
    toolId () {
      return `#${this.tool.id}`
    },
    toolName () {
      return `${this.tool.brand} ${this.tool.type}`
    },
    toolStatusClass () {
      return this.tool.status.split(' ').join('-')
    }
  },

  methods: {
    onClick () {
      this.$router.push({ name: 'toolDetail', params: { toolId: this.tool.id }})
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
          font-size: 20px;
        }
      }
    }

    // .image-container {
    //   flex: 0 0 75px;
    //   height: 100%;
    //   background-color: $background-dark-gray;
    //   border-top-right-radius: $tool-search-result-border-radius;
    //   border-bottom-right-radius: $tool-search-result-border-radius;
    //
    //   .tool-image {
    //     height: 100%;
    //     width: 100%;
    //   }
    // }
  }
</style>
