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
  data () {
    return {
      tag: '',
      tags: []
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
