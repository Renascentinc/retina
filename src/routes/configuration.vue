<template>
  <div class="page configuration-page">
    <transition name="fade">
      <div
        v-if="deleting"
        class="overlay">
        <div class="half-circle-spinner">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
        </div>
      </div>
    </transition>

    <header-card
      :title="title">
    </header-card>

    <div class="navigation">
      <i
        class="fas fa-arrow-left"
        @click="decrementTab"></i>
      <i
        class="fas fa-arrow-right"
        @click="incrementTab"></i>
    </div>

    <div class="config-menu-container">
      <!-- <div
        v-if="$mq === 'desktop'"
        class="spacer">
      </div> -->
      <div class="configs">
        <add-result
          v-if="title === 'Brands'"
          :on-save="addConfig"
          text="BRAND">
        </add-result>
        <add-result
          v-if="title === 'Types'"
          :on-save="addConfig"
          text="TYPE">
        </add-result>
        <add-result
          v-if="title === 'Suppliers'"
          :on-save="addConfig"
          text="SUPPLIER">
        </add-result>

        <config-item
          v-for="config in configs.unsanctioned"
          :key="config.id"
          :config-item="config"
          :on-delete="deleteConfig"
          :on-sanction-toggle="toggleSanction"
          :on-save="saveChanges">
        </config-item>

        <config-item
          v-for="config in configs.sanctioned"
          :key="config.id"
          :config-item="config"
          :on-delete="deleteConfig"
          :on-sanction-toggle="toggleSanction"
          :on-save="saveChanges">
        </config-item>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderCard from '../components/header-card'
import ConfigItem from '../components/config-item'
import ConfigurableItems from '../utils/configurable-items'
import gql from 'graphql-tag'
import vSelect from '../components/select'
import AddResult from '../components/add-result'
import swal from 'sweetalert2'

export default {
  name: 'Configuration',

  components: {
    HeaderCard,
    ConfigItem,
    ConfigurableItems,
    AddResult,
    vSelect
  },

  data () {
    return {
      getAllConfigurableItem: null,
      tab: 0,
      replacementList: [],
      replacementType: '',
      replacementName: '',
      replaceBrandWith: null,
      replaceTypeWith: null,
      replaceSupplierWith: null,
      deleting: false,
      deletedConfig: {},
      ConfigurableItems: ConfigurableItems
    }
  },

  computed: {
    typeOptions () {
      return this.types.sanctioned.filter(type => type.name !== this.deletedConfig.name)
    },

    supplierOptions () {
      return this.suppliers.sanctioned.filter(supplier => supplier.name !== this.deletedConfig.name)
    },

    brandOptions () {
      return this.brands.sanctioned.filter(brand => brand.name !== this.deletedConfig.name)
    },

    titles () {
      return {
        BRAND: 'Brands',
        TYPE: 'Types',
        PURCHASED_FROM: 'Suppliers'
      }
    },

    title () {
      var pages = [
        ConfigurableItems.BRAND,
        ConfigurableItems.TYPE,
        ConfigurableItems.PURCHASED_FROM
      ]
      return this.titles[pages[this.tab]]
    },

    page () {
      var pages = [
        ConfigurableItems.BRAND,
        ConfigurableItems.TYPE,
        ConfigurableItems.PURCHASED_FROM
      ]
      return pages[this.tab]
    },

    configs () {
      if (this.page === 'BRAND') {
        return this.brands
      } else if (this.page === 'TYPE') {
        return this.types
      } else if (this.page === 'PURCHASED_FROM') {
        return this.suppliers
      }
    },

    brands () {
      var sanctionedBrands = []
      var unsanctionedBrands = []

      if (this.getAllConfigurableItem) {
        this.getAllConfigurableItem.forEach(item => {
          if (
            item['type'] === ConfigurableItems.BRAND &&
            item['sanctioned'] === true
          ) {
            sanctionedBrands.push(item)
          } else if (
            item['type'] === ConfigurableItems.BRAND &&
            item['sanctioned'] === false
          ) {
            unsanctionedBrands.push(item)
          }
        })
      }
      return {
        sanctioned: sanctionedBrands,
        unsanctioned: unsanctionedBrands
      }
    },

    types () {
      var sanctionedTypes = []
      var unsanctionedTypes = []

      if (this.getAllConfigurableItem) {
        this.getAllConfigurableItem.forEach(item => {
          if (
            item['type'] === ConfigurableItems.TYPE &&
            item['sanctioned'] === true
          ) {
            sanctionedTypes.push(item)
          } else if (
            item['type'] === ConfigurableItems.TYPE &&
            item['sanctioned'] === false
          ) {
            unsanctionedTypes.push(item)
          }
        })
      }
      return {
        sanctioned: sanctionedTypes,
        unsanctioned: unsanctionedTypes
      }
    },

    suppliers () {
      var sanctionedSuppliers = []
      var unsanctionedSuppliers = []

      if (this.getAllConfigurableItem) {
        this.getAllConfigurableItem.forEach(item => {
          if (
            item['type'] === ConfigurableItems.PURCHASED_FROM &&
            item['sanctioned'] === true
          ) {
            sanctionedSuppliers.push(item)
          } else if (
            item['type'] === ConfigurableItems.PURCHASED_FROM &&
            item['sanctioned'] === false
          ) {
            unsanctionedSuppliers.push(item)
          }
        })
      }
      return {
        sanctioned: sanctionedSuppliers,
        unsanctioned: unsanctionedSuppliers
      }
    }
  },

  methods: {
    showInvalidItemMsg () {
      swal({
        type: 'warning',
        title: 'INVALID ITEM',
        text: 'You cannot create a duplicate item',
        timer: 2000,
        showConfirmButton: false
      })
    },

    showBlankItemMsg () {
      swal({
        type: 'warning',
        title: 'BLANK ITEM',
        text: 'You cannot create a blank item',
        timer: 1500,
        showConfirmButton: false
      })
    },

    showSuccessDelete () {
      swal({
        type: 'success',
        title: 'SUCCESS',
        text: 'Item has been deleted',
        timer: 1500,
        showConfirmButton: false
      })
    },

    showDeleteError () {
      swal({
        type: 'error',
        title: 'ERROR',
        text: 'There was an issue performing the delete. Please try again or contact support.',
        timer: 2000,
        showConfirmButton: false
      })
    },

    deleteConfig (config) {
      this.deletedConfig = config
      this.$apollo.mutate({
        mutation: gql`
          mutation deleteConfigurableItem($id: ID!) {
            deleteConfigurableItem(configurable_item_id: $id) {
              toolsWithConfigurableItem {
                id,
                type {
                  id
                },
                brand {
                  id
                },
                model_number,
                serial_number,
                status,
                owner {
                  ... on Location {
                    id
                  }
                  ... on User {
                    id
                  }
                },
                purchased_from {
                  id
                },
                date_purchased,
                photo,
                price,
                year
              }
              deletedConfigurableItem {
                id
              }
            }
          }
        `,
        variables: {
          id: config.id
        }
      }).then(response => {
        if (response.data.deleteConfigurableItem.deletedConfigurableItem) {
          this.showSuccessDelete()
          this.$apollo.queries.getAllConfigurableItem.refetch()
        } else {
          this.replacementList = response.data.deleteConfigurableItem.toolsWithConfigurableItem
          let inputOptions = {}
          let configurableItems
          if (this.page === ConfigurableItems.BRAND) {
            configurableItems = this.brandOptions
          } else if (this.page === ConfigurableItems.PURCHASED_FROM) {
            configurableItems = this.supplierOptions
          } else {
            configurableItems = this.typeOptions
          }
          configurableItems.forEach(ci => {
            inputOptions[ci.id] = ci.name
          })
          swal({
            title: 'DELETE ITEM',
            text: `${this.replacementList.length} tools are using this item. Replace with :`,
            showCancelButton: true,
            reverseButtons: true,
            cancelButtonText: 'CANCEL',
            confirmButtonText: 'REPLACE',
            confirmButtonColor: '#CE352F',
            input: 'select',
            inputPlaceholder: `Select new ${this.title.slice(0, -1)}`,
            inputOptions,
            inputValidator: (value) => {
              return !value && `New ${this.title.slice(0, -1)} required`
            }
          }).then(({ value, dismiss }) => {
            if (dismiss) {
              return
            }

            if (this.page === ConfigurableItems.BRAND) {
              this.replaceBrandWith = value
            } else if (this.page === ConfigurableItems.PURCHASED_FROM) {
              this.replaceSupplierWith = value
            } else {
              this.replaceTypeWith = value
            }
            this.finalizeDelete()
          })
        }
      })
    },

    finalizeDelete () {
      this.deleting = true
      Promise.all(this.replacementList.map(tool => {
        return this.$apollo
          .mutate({
            mutation: gql`
                mutation updateTool($tool: UpdatedTool!) {
                  updateTool(updatedTool: $tool) {
                    id
                  }
                }
              `,

            variables: {
              tool: {
                id: tool.id,
                type_id: this.page === ConfigurableItems.TYPE ? this.replaceTypeWith : tool.type.id,
                brand_id: this.page === ConfigurableItems.BRAND ? this.replaceBrandWith : tool.brand.id,
                model_number: tool.model_number,
                serial_number: tool.serial_number,
                status: tool.status,
                owner_id: tool.owner.id,
                purchased_from_id: this.page === ConfigurableItems.PURCHASED_FROM ? this.replaceSupplierWith : tool.purchased_from && tool.purchased_from.id,
                date_purchased: tool.date_purchased,
                photo: tool.photo,
                price: tool.price,
                year: tool.year
              }
            }
          })
      })).then(result => {
        this.deleteConfig(this.deletedConfig)
        this.deletedConfig = {}
      }).catch(() => {
        this.showDeleteError()
      }).finally(() => {
        this.deleting = false
      })
    },

    addConfig (name) {
      if (name === '') {
        this.showBlankItemMsg()
      } else {
        this.$apollo
          .mutate({
            mutation: gql`
              mutation createConfigurableItem($item: NewConfigurableItem!) {
                createConfigurableItem(newConfigurableItem: $item) {
                  type
                  name
                  sanctioned
                }
              }
            `,
            variables: {
              item: {
                type: this.page,
                name: name,
                sanctioned: true
              }
            }
          })
          .catch(response => {
            this.showInvalidItemMsg()
          })
          .then(result => {
            this.$apollo.queries.getAllConfigurableItem.refetch()
          })
      }
    },

    toggleSanction (config) {
      this.$apollo.mutate({
        mutation: gql`
          mutation updateConfigurableItem($item: UpdatedConfigurableItem!) {
            updateConfigurableItem(updatedConfigurableItem: $item) {
              id
              type
              name
              sanctioned
            }
          }
        `,
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
      if (config.name === '') {
        this.showBlankItemMsg()
      } else {
        this.$apollo
          .mutate({
            mutation: gql`
              mutation updateConfigurableItem($item: UpdatedConfigurableItem!) {
                updateConfigurableItem(updatedConfigurableItem: $item) {
                  id
                  type
                  name
                  sanctioned
                }
              }
            `,
            variables: {
              item: {
                id: config.id,
                name: config.name,
                sanctioned: config.sanctioned
              }
            }
          })
          .catch(response => {
            this.showInvalidItemMsg()
          })
          .then(result => {
            this.$apollo.queries.getAllConfigurableItem.refetch()
          })
      }
    },

    incrementTab () {
      this.tab = ++this.tab % 3
    },

    decrementTab () {
      this.tab = (this.tab + 2) % 3
    }
  },

  apollo: {
    getAllConfigurableItem: {
      query: gql`
        query getAllConfigurableItem {
          getAllConfigurableItem {
            id
            type
            name
            sanctioned
          }
        }
      `
    }
  }
}
</script>

<style lang="scss">
@import "../styles/variables";

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

    .configs {
      overflow-y: auto;
      flex: 1 1 auto;
      max-width: 500px;
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
