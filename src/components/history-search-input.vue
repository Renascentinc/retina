<template>
  <div class="search-input">
    <div class="search-icon-container">
      <i class="fas fa-search"></i>
    </div>
    <vue-tags-input
      v-model="tag"
      :tags="tags"
      :autocomplete-items="filteredItems"
      :add-only-from-autocomplete="true"
      placeholder="Search"
      @tags-changed="tagsChanged">

      <button
        slot="autocompleteItem"
        slot-scope="props"
        class="autocomplete-item"
        @click="() => props.performAdd(props.item)">
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
import HistoryActions from '../utils/history-actions'
import gql from 'graphql-tag'

export default {
  name: 'HistorySearchInput',
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
    getAllTool: {
      query: gql`query tools {
        getAllTool {
          id
        }
      }`,
      fetchPolicy: 'cache-and-network'
    },

    getAllLocation: gql`query {
      getAllLocation {
        id
        name
        type
      }
    }`,

    getAllUser: gql`query {
      getAllUser {
        id
        first_name
        last_name
        type
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
      let actions = [
        {
          name: 'Create',
          text: 'Create',
          id: HistoryActions.CREATE,
          iconClass: 'fa-info-circle',
          type: 'ACTION',
          formattedType: 'Action'
        },
        {
          name: 'Update',
          text: 'Update',
          id: HistoryActions.UPDATE,
          iconClass: 'fa-info-circle',
          type: 'ACTION',
          formattedType: 'Action'
        },
        {
          name: 'Transfer',
          text: 'Transfer',
          id: HistoryActions.TRANSFER,
          iconClass: 'fa-info-circle',
          type: 'ACTION',
          formattedType: 'Action'
        }
      ]

      return actions.concat(this.users).concat(this.locations).concat(this.tools)
    },

    filteredItems () {
      return this.autocompleteItems.filter(i => new RegExp(this.tag, 'i').test(i.text))
    },

    locations () {
      return (this.getAllLocation || []).map(location => {
        location.text = location.name
        location.formattedType = 'Location'
        location.iconClass = 'fa-map-marker-alt'
        return location
      })
    },

    tools () {
      return (this.getAllTool || []).map(tool => {
        tool.text = tool.id
        tool.name = tool.text
        tool.formattedType = 'Tool'
        tool.type = 'TOOL'
        tool.iconClass = 'fa-wrench'
        return tool
      })
    },

    users () {
      return (this.getAllUser || []).map(user => {
        user.text = `${user.first_name} ${user.last_name}`
        user.name = user.text
        user.formattedType = 'User'
        user.iconClass = 'fa-user'
        return user
      })
    }

    // searchableConfigItems () {
    //   let searchItems = []
    //   let items = (this.getAllConfigurableItem || [])
    //   items.forEach(item => {
    //     if (item.type !== ConfigurableItems.PURCHASED_FROM) {
    //       item.formattedType = item.type.split('_')[0].toLowerCase()
    //       item.text = `${item.formattedType} ${item.name}`
    //       item.iconClass = this.getTagIconClass(item.type)
    //       searchItems.push(item)
    //     }
    //   })
    //
    //   return searchItems
    // }
  },
  methods: {
    tagsChanged (newTags) {
      this.tags = newTags
      this.updateTags(newTags)
    }

    // getTagIconClass (type) {
    //   if (type === ConfigurableItems.BRAND) {
    //     return 'fa-tag'
    //   } else if (type === ConfigurableItems.TYPE) {
    //     return 'fa-wrench'
    //   }
    // }
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
