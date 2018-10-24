<template>
  <div class="search-input">
    <div class="search-icon-container">
      <i class="fas fa-search"/>
    </div>
    <vue-tags-input
      v-model="tag"
      :tags="tags"
      placeholder="Search"
      @tags-changed="tagsChanged"></vue-tags-input>
  </div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input'
import gql from 'graphql-tag'

export default {
  name: 'UserSearchInput',
  components: {
    VueTagsInput
  },
  props: {
    updateTags: {
      type: Function,
      required: true
    }
  },
  apollo: {
    getAllConfigurableItem: {
      query: gql`query {
        getAllConfigurableItem {
          id,
          type,
          name
        }
      }`
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
      return this.searchableItems.map(item => {
        item.formattedType = item.type.split('_')[0].toLowerCase()
        item.text = `${item.formattedType} ${item.name}`
        item.iconClass = this.getTagIconClass(item.type)
        return item
      })
    },
    filteredItems () {
      return this.autocompleteItems.filter(i => new RegExp(this.tag, 'i').test(i.text))
    },
    searchableItems () {
      return this.getAllConfigurableItem || []
    }
  },
  methods: {
    tagsChanged (newTags) {
      let fuzzySearch = null
      if (newTags.some(tag => !tag.name)) {
        fuzzySearch = newTags.pop().text
        this.tag = fuzzySearch
      }
      this.tags = newTags
      this.updateTags(fuzzySearch)
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/search-input';

</style>
