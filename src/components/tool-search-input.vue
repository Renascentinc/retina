<template>
  <div class="search-input">
    <div class="search-icon-container">
      <i class="fas fa-search"></i>
    </div>
    <vue-tags-input
      v-model="tag"
      :tags="tags"
      :autocomplete-items="filteredItems"
      placeholder="Search"
      @tags-changed="tagsChanged">

      <button
        slot="autocompleteItem"
        slot-scope="props"
        class="autocomplete-item"
        @click="() => performAdd(item)">
        <div class="item-name">
          {{ props.item.name }}
        </div>
        <div class="item-category">
          {{ props.item.formattedType }}
        </div>
      </button>

      <div
        slot="tagCenter"
        slot-scope="props">
        <i
          :class="props.tag.iconClass"
          class="fas tag-icon">
        </i>
        {{ props.tag.name }}
      </div>
    </vue-tags-input>
  </div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input'
import ConfigurableItems from '../utils/configurable-items'
import gql from 'graphql-tag'

export default {
  name: 'ToolSearchInput',
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
    getAllConfigurableItem: gql`query {
      getAllConfigurableItem {
        id,
        type,
        name
      }
    }`
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
      this.updateTags(newTags, fuzzySearch)
    },

    getTagIconClass (type) {
      if (type === ConfigurableItems.BRAND) {
        return 'fa-tag'
      } else if (type === ConfigurableItems.PURCHASED_FROM) {
        return 'fa-building'
      } else if (type === ConfigurableItems.TYPE) {
        return 'fa-wrench'
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/search-input';

.tag {
  background-color: $renascent-red !important;
  border-radius: 4px;
  padding-right: 2px;

  .tag-icon {
    font-size: 12px;
  }
}

.icon-close {
  padding-top: 1px;
}

.new-tag-input {
  font-weight: bold;
  font-size: 20px;
}

.autocomplete-item {
  display: flex;
  font-size: 20px;
  width: 100%;
  height: 35px;

  .item-name {
    flex: 1 1 auto;
    text-align: left;
  }

  .item-category {
    color: gray;
    text-transform: capitalize;
    flex: 0 0 95px;
    text-align: right;
    padding-right: 5px;
  }
}
</style>
