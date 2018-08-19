<template>
<div class="tools-page">
  <h1>Tools</h1>
  <tool-search-input/>
</div>
</template>

<script>
import ToolSearchInput from '../components/tool-search-input.vue';

export default {
  name: 'Tools',
  components: {
    ToolSearchInput
  }
}
</script>

<style lang="scss">
.tools-page {

}
</style>
