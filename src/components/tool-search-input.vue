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

export default {
  name: 'ToolSearchInput',
  components: {
    VueTagsInput
  },
  data () {
    return {
      tag: '',
      tags: [],
      autocompleteItems: [
        { text: 'Brand: Bosch' },
        { text: 'Brand: DeWalt' },
        { text: 'Type: Drill Driver' },
        { text: 'Type: Hammer Drill' },
        { text: 'Status: Available' }
      ]
    }
  },
  computed: {
    filteredItems() {
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
