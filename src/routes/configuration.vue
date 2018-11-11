<template>
  <div class="page configuration-page">

    <div
      v-if="showReplacementModal"
      class="replacement-scrim">
      <div class="replacement-modal">
        <span> {{ replacementList.length }} tools are using this item. </span>
        <span> Replace each use of {{ replacementName }} with: </span>
        <v-select
          v-validate:replaceBrandWith="'required'"
          v-if="page === ConfigurableItems.BRAND"
          v-model="replaceBrandWith"
          :options="brandOptions"
          label="name"
          class="dark-input"
          placeholder="Brand"
          name="replaceBrandWith">
        </v-select>
        <v-select
          v-validate:replaceTypeWith="'required'"
          v-if="page === ConfigurableItems.TYPE"
          v-model="replaceTypeWith"
          :options="typeOptions"
          label="name"
          class="dark-input"
          placeholder="Type"
          name="replaceTypeWith">
        </v-select>
        <v-select
          v-validate:replaceSupplierWith="'required'"
          v-if="page === ConfigurableItems.PURCHASED_FROM"
          v-model="replaceSupplierWith"
          :options="supplierOptions"
          label="name"
          class="dark-input"
          placeholder="Supplier"
          name="replaceSupplierWith">
        </v-select>
        <div class="modal-actions">
          <span>
            <i
              class="fas fa-times"
              @click="closeReplacementModal"></i>
            <span class="modal-text">CANCEL</span>
          </span>
          <span>
            <i
              class="fas fa-arrow-right"
              @click="finalizeDelete"></i>
            <span class="modal-text">FINISH</span>
          </span>
        </div>
      </div>
    </div>
    <header-card
      :title="title"
      exit-link="/">
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
      <div
        v-if="$mq === 'desktop'"
        class="spacer">
      </div>
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
import VueNotifications from 'vue-notifications'
import AddResult from '../components/add-result'

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
      showReplacementModal: false,
      replacementList: [],
      replacementType: '',
      replacementName: '',
      replaceBrandWith: null,
      replaceTypeWith: null,
      replaceSupplierWith: null,
      deletedConfig: {},
      ConfigurableItems: ConfigurableItems
    }
  },

  notifications: {
    showInvalidItemMsg: {
      type: VueNotifications.types.warn,
      title: 'INVALID ITEM',
      message: 'You cannot create a duplicate item'
    },
    showBlankItemMsg: {
      type: VueNotifications.types.warn,
      title: 'BLANK ITEM',
      message: 'You cannot create a blank item'
    },
    showSuccessDelete: {
      type: VueNotifications.types.success,
      title: 'SUCCESS',
      message: 'Item has been deleted'
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
          this.$apollo.queries.getAllConfigurableItem.refresh()
        } else {
          this.replacementList = response.data.deleteConfigurableItem.toolsWithConfigurableItem
          this.openReplacementModal(config)
        }
      })
    },

    openReplacementModal (config) {
      this.replacementType = config.type.toLowerCase()
      this.replacementName = config.name.toLowerCase()
      this.showReplacementModal = true
    },

    closeReplacementModal () {
      this.replacementType = ''
      this.replacementName = ''
      this.replacementList = []
      this.showReplacementModal = false
    },

    finalizeDelete () {
      this.replacementList.forEach(tool => {
        console.log(tool)
        this.$apollo
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
                type_id: this.page === ConfigurableItems.TYPE ? this.replaceTypeWith.id : tool.type.id,
                brand_id: this.page === ConfigurableItems.BRAND ? this.replaceBrandWith.id : tool.brand.id,
                model_number: tool.model_number,
                serial_number: tool.serial_number,
                status: tool.status,
                owner_id: tool.owner.id,
                purchased_from_id: this.page === ConfigurableItems.PURCHASED_FROM ? this.replaceSupplierWith.id : tool.purchased_from.id,
                date_purchased: tool.date_purchased,
                photo: tool.photo,
                price: tool.price,
                year: tool.year
              }
            }
          })
          .then(result => {
            this.deleteConfig(this.deletedConfig)
            this.closeReplacementModal()
            this.deletedConfig = {}
          })
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
            this.$apollo.queries.getAllConfigurableItem.refresh()
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
            this.$apollo.queries.getAllConfigurableItem.refresh()
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
      `,
      fetchPolicy: 'cache-and-network'
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

  .replacement-scrim {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.25);
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;

    .replacement-modal {
      z-index: 11;
      background-color: white;
      border-radius: 5px;
      width: calc(100% - 60px);
      max-width: 350px;
      font-size: 22px;
      font-weight: 600;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      padding: 15px;
      line-height: 30px;

      .v-select {
        margin-top: 15px;
        margin-bottom: 15px;
        width: 250px;
        font-size: 16px;
        height: 45px;
        margin-left: auto;
        margin-right: auto;

        * {
          font-size: 16px;
        }
      }

      .modal-actions {
        display: flex;
        justify-content: space-around;
        padding: 15px;
        font-size: 30px;
        color: $renascent-red;

        .modal-text {
          font-size: 14px;
          color: $renascent-dark-gray;
        }

        i {
          border: solid $renascent-red 2px;
          border-radius: 50%;
          color: $renascent-red;
          width: 50px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
      }
    }
  }

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
    flex-direction: row;
    width: 100%;

    .spacer {
      min-width: 158px;
      flex: 1 1 auto;
      max-width: 300px;
    }

    .configs {
      overflow-y: auto;
      z-index: 0;
      flex: 1 1 auto;
    }
  }
}

// MOBILE

.mobile {
  .navigation {
    width: 100%;

    i {
      font-size: 30px;
    }
  }
}

// DESKTOP

.desktop {
  .navigation {
    width: calc(100% - 60px);

    i {
      font-size: 25px;
    }
  }
}
</style>
