<template>
  <div class="page configuration-page">

    <loading-overlay :active="deleting" />

    <header-card :title="pageTitle"/>

    <div class="navigation">
      <i class="fas fa-arrow-left" @click="decrementTab"/>
      <i class="fas fa-arrow-right" @click="incrementTab"/>
    </div>

    <div class="config-menu-container">
      <div class="configs">
        <add-result
          :on-save="addConfig"
          :text="addItemText"
        />

        <config-item
          v-for="config in configs"
          :key="config.id"
          :config-item="config"
          :on-delete="deleteConfig"
          :on-sanction-toggle="toggleSanction"
          :on-save="saveChanges"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Tool from '@/models/tool'
import LoadingOverlay from '@/components/basic/loading-overlay'
import HeaderCard from '@/components/header-card'
import ConfigItem from '@/components/config-item'
import ConfigurableItems from '@/utils/configurable-items'
import AddResult from '@/components/add-result'
import swal from 'sweetalert2'
import {
  showErrorMsg,
  showSuccessMsg,
  showWarningMsg
} from '@/utils/alerts'
import {
  configurableItemQuery,
  deleteConfigurableItemMutation,
  updateToolMutation,
  createConfigurableItemMutation,
  updateConfigurableItemMutation
} from '@/utils/gql'

export default {
  name: 'Configuration',

  components: {
    LoadingOverlay,
    HeaderCard,
    ConfigItem,
    AddResult
  },

  apollo: {
    getAllConfigurableItem: {
      query: configurableItemQuery,
      fetchPolicy: 'network-only'
    }
  },

  data () {
    return {
      tab: 0,
      deleting: false
    }
  },

  computed: {
    pageTitle () {
      switch (this.page) {
        case ConfigurableItems.BRAND:
          return 'Brands'
        case ConfigurableItems.TYPE:
          return 'Types'
        case ConfigurableItems.PURCHASED_FROM:
          return 'Suppliers'
        default:
          return ''
      }
    },

    addItemText () {
      switch (this.page) {
        case ConfigurableItems.BRAND:
          return 'BRAND'
        case ConfigurableItems.TYPE:
          return 'TYPE'
        case ConfigurableItems.PURCHASED_FROM:
          return 'SUPPLIER'
        default:
          return ''
      }
    },

    page () {
      let pages = [
        ConfigurableItems.BRAND,
        ConfigurableItems.TYPE,
        ConfigurableItems.PURCHASED_FROM
      ]
      return pages[this.tab]
    },

    configs () {
      return (this.getAllConfigurableItem || []).filter(item => item.type === this.page).sort((a, b) => a.sanctioned !== b.sanctioned).reverse()
    }
  },

  methods: {
    showInvalidItemMsg () {
      showWarningMsg('You cannot create a duplicate item', 'INVALID ITEM')
    },

    incrementTab () {
      this.tab = ++this.tab % 3
    },

    decrementTab () {
      this.tab = (this.tab + 2) % 3
    },

    async deleteConfig (config) {
      let response = await this.$apollo.mutate({
        mutation: deleteConfigurableItemMutation,
        variables: {
          id: config.id
        }
      })

      if (response.data.deleteConfigurableItem.deletedConfigurableItem) {
        this.$apollo.queries.getAllConfigurableItem.refetch()
        return showSuccessMsg('Item has been deleted')
      }

      let replacementList = response.data.deleteConfigurableItem.toolsWithConfigurableItem
      let inputOptions = {}
      let configurableItems = this.getAllConfigurableItem.filter((item) => item.type === this.page && item.name !== config.name)
      configurableItems.forEach(item => {
        inputOptions[item.id] = item.name
      })

      let { value, dismiss } = await swal({
        title: 'DELETE ITEM',
        text: `${replacementList.length} tools are using this item. Replace with :`,
        showCancelButton: true,
        reverseButtons: true,
        cancelButtonText: 'CANCEL',
        confirmButtonText: 'REPLACE',
        confirmButtonColor: '#CE352F',
        input: 'select',
        inputPlaceholder: `Select new ${this.page.toLowerCase()}`,
        inputOptions,
        inputValidator: (value) => !value && `New ${this.page.toLowerCase()} required`
      })

      if (dismiss) {
        return
      }

      let replacementItem = {
        type: this.page,
        key: null,
        value
      }
      if (this.page === ConfigurableItems.BRAND) {
        replacementItem.key = 'brand_id'
      } else if (this.page === ConfigurableItems.PURCHASED_FROM) {
        replacementItem.key = 'type_id'
      } else {
        replacementItem.key = 'purchased_from_id'
      }
      this.finalizeDelete(config, replacementList, replacementItem)
    },

    finalizeDelete (config, replacementList, replacementItem) {
      this.deleting = true
      Promise.all(replacementList.map(tool => {
        tool = new Tool(tool).getState()
        tool[replacementItem.key] = replacementItem.value

        return this.$apollo.mutate({
          mutation: updateToolMutation,
          variables: {
            tool
          }
        })
      })).then(result => {
        this.deleteConfig(config)
      }).catch(() => {
        showErrorMsg('There was an issue performing the delete. Please try again or contact support.')
      }).finally(() => {
        this.deleting = false
      })
    },

    addConfig (name) {
      this.$apollo.mutate({
        mutation: createConfigurableItemMutation,
        variables: {
          newConfigurableItem: {
            type: this.page,
            name,
            sanctioned: true
          }
        }
      }).then(result => {
        this.$apollo.queries.getAllConfigurableItem.refetch()
      }).catch(response => {
        this.showInvalidItemMsg()
      })
    },

    toggleSanction (config) {
      this.$apollo.mutate({
        mutation: updateConfigurableItemMutation,
        variables: {
          item: {
            id: config.id,
            name: config.name,
            sanctioned: !config.sanctioned
          }
        }
      })
    },

    saveChanges (config) {
      this.$apollo.mutate({
        mutation: updateConfigurableItemMutation,
        variables: {
          item: {
            id: config.id,
            name: config.name,
            sanctioned: config.sanctioned
          }
        }
      }).then(result => {
        this.$apollo.queries.getAllConfigurableItem.refetch()
      }).catch(response => {
        this.showInvalidItemMsg()
      })
    }
  }
}
</script>

<style lang="scss">

.configuration-page {
  display: flex;
  flex-direction: column;
  background-color: $background-light-gray;
  overflow-y: hidden;

  .navigation {
    position: absolute;
    z-index: 5;
    height: 73px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    i {
      padding-right: 40px;
      padding-left: 40px;
      color: $renascent-red;
      cursor: pointer;
    }
  }

  .header-card {
    z-index: 1;
  }

  .config-menu-container {
    display: flex;
    justify-content: center;
    flex-direction: row;
    width: 100%;
    height: calc(100% - 73px);

    .configs {
      overflow-y: auto;
      flex: 1 1 auto;
      max-width: 500px;
      padding-bottom: 10px;
    }
  }
}

.mobile .configuration-page {
  .navigation {
    width: 100%;

    i {
      font-size: 30px;
    }
  }
}

.desktop .configuration-page {
  .navigation {
    width: calc(100% - 60px);

    i {
      font-size: 25px;
    }
  }
}
</style>
