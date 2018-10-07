<template>
  <transition name="fade">
    <div class="page tools-page">
      <div class="search-bar">
        <tool-search-input/>
      </div>
      <div class="tool-scroll-container">
        <transition name="fade">
          <div v-if="!getAllTool.length" class="no-tools-container">
            <span class="no-tools-text">No Tools Added Yet</span>
          </div>
        </transition>
        <transition-group name="list" tag="div">
          <tool-search-result v-for="tool in getAllTool" :tool="tool" :key="tool.id" :onSelect="transitionToToolInfo"/>
        </transition-group>
      </div>

      <extended-fab class="transfer-btn" iconClass="fa-exchange-alt" buttonText="TRANSFER" :onClick="() => 0"></extended-fab>
    </div>
  </transition>
</template>

<script>
import ToolSearchInput from '../components/tool-search-input.vue';
import ToolSearchResult from '../components/tool-search-result.vue';
import ExtendedFab from '../components/extended-fab.vue';
import gql from 'graphql-tag'

export default {
  name: 'tools',
  components: {
    ToolSearchInput,
    ToolSearchResult,
    ExtendedFab
  },
  apollo: {
    getAllTool: gql`query tools {
      getAllTool {
        id
        type {
          name
        }
        brand {
          name
        }
        status
        user {
          first_name
          last_name
        }
        location {
          name
        }
      }
    }`
  },
  methods: {
    transitionToToolInfo(toolId) {
      this.$router.push({ name: 'toolDetail', params: { toolId }})
    }
  },

  data() {
    return {
      getAllTool: []
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.tools-page {
  display: flex;
  flex-direction: column;

  .search-bar {
    padding: 10px;
  }

  .tool-scroll-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: $background-light-gray;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-top: 5px;
  }

  .no-tools-container {
    display: flex;
    justify-content: center;
    padding-top: 50px;
  }

  .transfer-btn {
    position: absolute;
    bottom: 60px;
    left: calc(50% - 68px);
    width: 142px;
  }
}
</style>
