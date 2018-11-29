<template>
  <div class="search-input">
    <div class="search-icon-container">
      <i class="fas fa-search"/>
    </div>
    <input
      ref="searchInput"
      v-model="search"
      placeholder="Search"
      class="user-search-input"
      @keydown.enter="searchAndBlur">
  </div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input'
import debounce from 'debounce'

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
      search: ''
    }
  },
  watch: {
    search: debounce(function (search) {
      this.updateTags(search)
    }, 300)
  },

  methods: {
    searchAndBlur () {
      this.updateTags(this.search)
      this.$refs.searchInput.blur()
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/search-input';

.user-search-input {
  font-weight: bold;
  font-size: 20px;
  width: 100%;
  padding-left: 10px;
  border: none;
}
</style>
