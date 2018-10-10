<template>
  <div class="page tools-page">
    <div class="search-bar">
      <tool-search-input/>
    </div>
    <div class="tool-scroll-container">
      <div class="add-btn-container">
        <fab
          :on-click="transitionToAdd"
          class="add-btn"
          icon-class="fa-plus"/>
      </div>
      <transition name="fade">
        <div
          v-if="$apollo.queries.searchTool.loading"
          class="loading-container">
          <span class="no-tools-text">Loading...</span>
        </div>
      </transition>
      <transition name="fade">
        <div
          v-if="!$apollo.queries.searchTool.loading && !searchTool.length"
          class="no-tools-container">
          <span class="no-tools-text">No Tools Added Yet</span>
        </div>
      </transition>
      <transition-group
        name="list"
        tag="div">
        <tool-search-result
          v-for="tool in searchTool"
          :tool="tool"
          :key="tool.id"
          :on-select="transitionToToolInfo"/>
      </transition-group>
    </div>

    <extended-fab
      :on-click="() => 0"
      class="transfer-btn"
      icon-class="fa-exchange-alt"
      button-text="TRANSFER"/>
  </div>
</template>

<script>
import ToolSearchInput from '../components/tool-search-input.vue'
import ToolSearchResult from '../components/tool-search-result.vue'
import ExtendedFab from '../components/extended-fab.vue'
import Fab from '../components/fab.vue'
import gql from 'graphql-tag'

export default {
  name: 'Tools',

  components: {
    ToolSearchInput,
    ToolSearchResult,
    ExtendedFab,
    Fab
  },

  apollo: {
    searchTool: {
      query: gql`query tools($query: String, $toolFilter: ToolFilter, $pagingParameters: PagingParameters) {
        searchTool(query: $query, toolFilter: $toolFilter, pagingParameters: $pagingParameters) {
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
      }`,
      variables () {
        let options = {}

        // if (this.searchString) {
        //   options.query = this.searchString
        // }

        return options
      },
      error (error) {
        window.console.log('search error...')
      }
    }
  },

  data () {
    return {
      searchTool: []
    }
  },

  methods: {
    transitionToToolInfo (toolId) {
      this.$router.push({ name: 'toolDetail', params: { toolId } })
    },
    transitionToAdd () {
      this.$router.push({ name: 'newTool' })
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

  .add-btn-container {
    flex: 0 0 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
