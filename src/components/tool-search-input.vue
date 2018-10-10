<template>
  <div class="tool-search-input">
    <div class="search-icon-container">
      <i class="material-icons">search</i>
    </div>
    <vue-tags-input
      v-model="tag"
      :tags="tags"
      :autocomplete-items="filteredItems"
      @tags-changed="tagsChanged"/>
  </div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input'
import gql from 'graphql-tag'

export default {
  name: 'ToolSearchInput',
  components: {
    VueTagsInput
  },
  apollo: {
    getAllConfigurableItem: {
      query: gql`query getAllConfigurableItem($pagingParameters: PagingParameters) {
        getAllConfigurableItem(pagingParameters: $pagingParameters) {
          id,
          type,
          name
        }
      }`,
      variables: { },
      error (error) {
        console.log('configurable item query error')
      }
    }
  },
  data () {
    return {
      tag: '',
      tags: []
    }
  },
  computed: {
    autocompleteItems () {
      if (this.getAllConfigurableItem) {
        return this.getAllConfigurableItem.map(item => {
          item.text = `${item.type.split('_').join(' ').toLowerCase()}: ${item.name}`
          return item
        })
      }

      return []
    },
    filteredItems () {
      return this.autocompleteItems.filter(i => new RegExp(this.tag, 'i').test(i.text))
    }
  },
  methods: {
    tagsChanged (newTags) {
      this.tags = newTags
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.tool-search-input {
  display: flex;
  align-items: center;
  border: solid 1px;
  border-radius: 5px;
  padding-left: 5px;

  .search-icon-container {
    display: flex;
    flex: 0 0 20px;
  }

  .vue-tags-input {
    font-weight: bold;
    width: 100%;
    border-radius: 5px;

    .input {
      border: none;
    }

    .tag {
      background-color: $renascent-red !important;
      padding-right: 2px;
    }

    .icon-close {
      padding-top: 1px;
    }

    .new-tag-input {
      font-weight: bold;
    }
  }
}
</style>
