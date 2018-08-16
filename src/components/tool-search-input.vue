<template>
<div class="tool-search-input">
  <vue-tags-input
    v-model="tag"
    :tags="tags"
    :autocomplete-items="filteredItems"
    @tags-changed="newTags => tags = newTags">
  </vue-tags-input>
</div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input';

export default {
  name: 'tool-search-input',
  components: {
    VueTagsInput,
  },
  data() {
    return {
      tag: '',
      tags: [],
      autocompleteItems: [{
        text: 'Spain',
      }, {
        text: 'France',
      }, {
        text: 'USA',
      }, {
        text: 'Germany',
      }, {
        text: 'China',
      }],
    };
  },
  computed: {
    filteredItems() {
      return this.autocompleteItems.filter(i => new RegExp(this.tag, 'i').test(i.text));
    },
  }
}
</script>

<style lang="scss">
.tool-search-input {

}
</style>
