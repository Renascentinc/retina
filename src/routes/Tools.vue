<template>
<div class="page tools-page">
  <div class="search-bar">
    <tool-search-input/>
  </div>
  <div class="tool-scroll-container">
    <tool-search-result v-for="tool in tools" :tool="tool"/>
  </div>
  <div class="nav-bar">
    <i class="material-icons">menu</i>
    <i class="material-icons">add</i>
  </div>
</div>
</template>

<script>
import ToolSearchInput from '../components/tool-search-input.vue';
import ToolSearchResult from '../components/tool-search-result.vue';

export default {
  name: 'Tools',
  components: {
    ToolSearchInput,
    ToolSearchResult
  },

  data() {
    return {
      tools: [
        {
          id: '93713',
          brand: 'bosch',
          status: 'out of service',
          assignee: 'colin powell',
          type: 'hammer drill'
        },
        {
          id: '94702',
          brand: 'dewalt',
          status: 'available',
          assignee: 'james alstrong',
          type: 'driver'
        },
        {
          id: '31348',
          brand: 'dewalt',
          status: 'in use',
          assignee: 'colin powell',
          type: 'hammer drill'
        }
      ]
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
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .nav-bar {
    display: flex;
    flex: 0 0 40px;
    background-color: $renascent-dark-gray;
    align-items: center;
    justify-content: space-between;
    color: white;
    padding: 0 30px;
    font-size: 30px;
  }
}
</style>
