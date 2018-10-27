<template>
  <div class="page new-user-page">
    <header-card
      title="New User"
      exit-link="/users"></header-card>
  </div>
</template>

<script>
import HeaderCard from '../components/header-card'
import ToolSearchResult from '../components/tool-search-result.vue'
import ExtendedFab from '../components/extended-fab.vue'
import Fab from '../components/fab'
import vSelect from '../components/select'
import gql from 'graphql-tag'

export default {
  name: 'NewTool',

  components: {
    HeaderCard
  }

}
</script>

<style lang="scss">
@import '../styles/variables';

</style>
