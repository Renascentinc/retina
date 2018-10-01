<template>
  <transition name="fade">
    <div class="page tools-page">
      <div class="search-bar">
        <tool-search-input/>
      </div>
      <div class="tool-scroll-container">
        <transition name="fade">
          <div v-if="!tools.length" class="no-tools-container">
            <span class="no-tools-text">No Tools Added Yet</span>
          </div>
        </transition>
        <transition-group name="list" tag="div">
          <tool-search-result v-for="tool in tools" :tool="tool" :key="tool.id" @onSelect="transitionToToolInfo"/>
        </transition-group>
      </div>
      <div class="extended-fab transfer">
        <i class="fas fa-check"></i>
        SELECT
      </div>
    </div>
  </transition>
</template>

<script>
import ToolSearchInput from '../components/tool-search-input.vue';
import ToolSearchResult from '../components/tool-search-result.vue';

export default {
  name: 'tools',
  components: {
    ToolSearchInput,
    ToolSearchResult
  },
  methods: {
    transitionToToolInfo(toolId) {
      this.$router.push({ path: `/tool/${toolId}` })
    }
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
        },
        {
          id: '31343',
          brand: 'bosch',
          status: 'maintenance',
          assignee: 'colin powell',
          type: 'jigsaw'
        },
        {
          id: '93712',
          brand: 'bosch',
          status: 'out of service',
          assignee: 'colin powell',
          type: 'hammer drill'
        },
        {
          id: '94402',
          brand: 'dewalt',
          status: 'available',
          assignee: 'james alstrong',
          type: 'driver'
        },
        {
          id: '31378',
          brand: 'dewalt',
          status: 'in use',
          assignee: 'colin powell',
          type: 'hammer drill'
        },
        {
          id: '33343',
          brand: 'bosch',
          status: 'maintenance',
          assignee: 'colin powell',
          type: 'jigsaw'
        },
        {
          id: '93513',
          brand: 'bosch',
          status: 'out of service',
          assignee: 'colin powell',
          type: 'hammer drill'
        },
        {
          id: '94782',
          brand: 'dewalt',
          status: 'available',
          assignee: 'james alstrong',
          type: 'driver'
        },
        {
          id: '32348',
          brand: 'dewalt',
          status: 'in use',
          assignee: 'colin powell',
          type: 'hammer drill'
        },
        {
          id: '31349',
          brand: 'bosch',
          status: 'maintenance',
          assignee: 'colin powell',
          type: 'jigsaw'
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
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-top: 5px;
  }

  .no-tools-container {
    display: flex;
    justify-content: center;
    padding-top: 50px;
  }
}
</style>
