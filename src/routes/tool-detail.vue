<template>
  <div class="page tool-detail-page">
    <div class="header">
      <router-link
        class="fas fa-arrow-left backarrow"
        to="/tools">
      </router-link>

      <span class="toolid">#{{ getTool.id }} </span>

      <span class="header-spacer"></span>
      <div
        class="name"
        v-if="!editState">
        {{ brand }} {{ type }}
      </div>

      <div
        class="input-group-container"
        v-if="editState">
          <v-select
            v-validate:brand="'required'"
            :options="brandOptions"
            v-model="newBrand"
            name="brand"
            label="name"
            class="dark-input"
            placeholder="Brand">
            <template
              slot="no-options"
              slot-scope="props">
              <button
                class="no-options-btn"
                @click="() => brand = { name: props.value, type: 'BRAND', isNewConfigurableItem: true }">
                Set Brand To "{{ props.value }}"
              </button>
            </template>
          </v-select>
          <div class="error-container">
            <span
              v-show="errors.has('brand')"
              class="error">
              {{ errors.first('brand') }}
            </span>
          </div>
      </div>

      <div
        class="input-group-container"
        v-if="editState">
          <v-select
            v-validate:type="'required'"
            v-model="newType"
            :options="typeOptions"
            name="type"
            label="name"
            class="dark-input"
            placeholder="Type">
            <template
              slot="no-options"
              slot-scope="props">
              <button
                class="no-options-btn"
                @click="() => type = { name: props.value, type: 'TYPE', isNewConfigurableItem: true }">
                Set Type To "{{ props.value }}"
              </button>
            </template>
          </v-select>
          <div class="error-container">
            <span
              v-show="errors.has('type')"
              class="error">
              {{ errors.first('type') }}
            </span>
          </div>
        </div>



      <div
        v-if="isTransferable"
        class="actions">
        <button-dropdown
          :on-click="updateStatus"
          :options="['AVAILABLE', 'IN USE', 'MAINTENANCE', 'OUT OF SERVICE']"
          :button-text="`${ formattedStatus }`">
        </button-dropdown>

        <button
          class="action-btn"
          @click="toggleTransferStatus">
          <i class="fas fa-exchange-alt action-icon"></i>
          <span class="action-title">{{ isToolSelected ? 'DESELECT' : 'TRANSFER' }}</span>
        </button>
      </div>
    </div>
    <div class="cards">
      <div class="card owner-card">
        <div class="card-title">
          Owner
        </div>
        <div class="card-details owner-details">
          <div class="user-symbol">
            <i
              :class="{ 'fa-user': owner.type === 'USER', 'fa-map-marker-alt': owner.type === 'LOCATION' }"
              class="fas fa-user">
            </i>
          </div>
          <div class="owner-name">
            <div
              v-if="owner.type === 'LOCATION'"
              class="owner-location">
              {{ owner.name }}
            </div>
            <div
              v-if="owner.type === 'USER'"
              class="owner-user">
              <span> {{ owner.first_name }} </span>
              <span> {{ owner.last_name }} </span>
            </div>
          </div>
          <div class="contact-buttons">
            <fab
              :on-click="phoneCall"
              :disabled="!phoneNumber"
              class="call-btn"
              icon-class="fa-phone">
            </fab>

            <div class="spacer"></div>

            <fab
              :on-click="sendEmail"
              :disabled="!email"
              class="email-btn"
              icon-class="fa-envelope">
            </fab>
          </div>
        </div>
      </div>
      <div
        class="card general-card">
        <div class="card-title">
          General
        </div>
        <div class="card-details general-details">
          <span class="general-label">Retina ID</span>
          <span class="general-data"> {{ getTool.id || '-' }} </span>

          <span class="general-label">Serial Number</span>
          <span class="general-data"> {{ getTool.serial_number || '-' }} </span>

          <span class="general-label">Model Mumber</span>
          <span class="general-data"> {{ getTool.model_number || '-' }} </span>

          <span class="general-label">Model Year</span>
          <span class="general-data"> {{ getTool.year || '-' }} </span>

          <span class="general-label">Purchased From</span>
          <span class="general-data"> {{ purchasedFrom }} </span>

          <span class="general-label">Purchase Date</span>
          <span class="general-data"> {{ formattedDate }} </span>

          <span class="general-label">Purchase Price</span>
          <span class="general-data"> ${{ formattedPrice }} </span>
        </div>

      </div>

      <div
        class="card photo-card">
        <div class="card-title">
          Photo
        </div>
        <div class="photo-box">
          <img
            v-lazy="`${getTool.photo}`"
            v-if="getTool.photo"
            class="image">
          <i
            v-if="!getTool.photo"
            class="fas fa-image no-image">
          </i>
        </div>
      </div>
    </div>
    <fab
      v-if="canEdit"
      :on-click="toggleEditState"
      :icon-class="editState ? 'fa-save' : 'fa-pen'"
      class="edit"></fab>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import Avatar from 'vue-avatar'
import Fab from '../components/fab.vue'
import vSelect from '../components/select'
import VueLazyload from 'vue-lazyload'
import ConfigurableItems from '../utils/configurable-items.js'
import ButtonDropdown from '../components/button-dropdown.vue'

export default {
  name: 'ToolDetail',

  components: {
    Avatar,
    Fab,
    ButtonDropdown,
    VueLazyload,
    vSelect
  },

  apollo: {
    getAllConfigurableItem: gql`query {
      getAllConfigurableItem {
        id
        type
        name
        sanctioned
      }
    }`,

    getTool: {
      query: gql`
        query tool($tool_id: ID!) {
          getTool(tool_id: $tool_id) {
            id
            brand {
              id
              name
            }
            type {
              id
              name
            }
            year
            status
            model_number
            serial_number
            purchased_from {
              id
              name
            }
            date_purchased
            price
            photo

            owner {
              ... on Location {
                id
                name
                type
              }
              ... on User {
                id
                first_name
                last_name
                email
                phone_number
                type
              }
            }
          }
        }
      `,
      variables () {
        let options = {}
        options.tool_id = this.$router.currentRoute.params.toolId
        return options
      },
      fetchPolicy: 'cache-and-network'
    }
  },

  data () {
    return {
      getTool: {},
      editState: false,
      newBrand: {},
      newType: {},
      newSerial: {},
      newModel: {},
      newYear: {},
      newPurchasedFrom: {},
      newPurchaseDate: {},
      newPrice: {},
      window: window
    }
  },

  computed: {
    isToolSelected () {
      return !!this.$store.state.selectedToolsMap[this.getTool.id]
    },

    brandOptions () {
      return this.getConfigurableItemsForType(ConfigurableItems.BRAND)
    },

    typeOptions () {
      return this.getConfigurableItemsForType(ConfigurableItems.TYPE)
    },

    canEdit () {
      return true
    },

    owner () {
      return this.getTool.owner || {}
    },

    brand () {
      let brand = this.getTool.brand
      return brand && brand.name
    },

    type () {
      let type = this.getTool.type
      return type && type.name
    },

    purchasedFrom () {
      let purchasedFrom = this.getTool.purchased_from
      return purchasedFrom ? purchasedFrom.name : '-'
    },

    formattedStatus () {
      let status = this.getTool.status
      return status && status.replace(/_/g, ' ').toUpperCase()
    },

    formattedDate (date) {
      let datePurchased = date
      return datePurchased ? new Date(datePurchased).toLocaleDateString('en-US') : '-'
    },

    formattedPrice () {
      let priceString = this.getTool.price
      return priceString ? `${priceString / 100}` : ' -'
    },

    isTransferable () {
      let currentUser = JSON.parse(window.localStorage.getItem('currentUser'))
      return (this.owner.type === 'LOCATION') || (this.owner.type === 'USER' && currentUser.id === this.owner.id)
    },

    phoneNumber () {
      if (this.owner.type === 'USER') {
        return this.owner.phone_number
      } else if (this.owner.type === 'LOCATION') {
        return this.owner.phone_number
      }
    },

    email () {
      if (this.owner.type === 'USER') {
        return this.owner.email
      } else if (this.owner.type === 'LOCATION') {
        return this.owner.email
      }
    }
  },

  methods: {
    getConfigurableItemsForType (type) {
      return this.getAllConfigurableItem.filter(item => item.type === type && item.sanctioned)
    },

    toggleEditState () {
      if (this.editState) {
        this.saveTool()
      } else {
        this.newBrand = this.getTool.brand
        this.newType = this.getTool.type
        this.newSerial = this.getTool.serial_number
        this.newModel = this.getTool.model_number
        this.newYear = this.getTool.year
        this.newPurchasedFrom = this.getTool.purchased_from
        this.newPurchaseDate = this.getTool.date_purchased
        this.newPrice = this.getTool.price
        this.editState = true
      }
    },

    saveTool () {
      this.$apollo.mutate({
        mutation: gql`
          mutation updateTool($tool: UpdatedTool!) {
            updateTool(updatedTool: $tool) {
              id
            }
          }`,

        variables: {
          tool: {
            id: this.getTool.id,
            type_id: this.newType.id,
            brand_id: this.newBrand.id,
            model_number: this.newModel,
            serial_number: this.newSerial,
            status: this.getTool.status,
            owner_id: this.getTool.owner.id,
            purchased_from_id: this.newPurchasedFrom.id,
            // TODO: figure out why api chokes on its own dates
            date_purchased: this.newPurchaseDate.replace(/\(.*\)/g, ''),
            photo: this.getTool.photo,
            price: this.newPrice,
            year: this.newYear
          }
        }
      }).then(result => {
        this.$apollo.queries.getTool.refresh()
        this.editState = false
      })
    },

    toggleTransferStatus () {
      this.$store.commit('toggleToolSelection', this.getTool.id)
      this.$router.push({ path: '/tools' })
    },

    phoneCall () {
      window.location.href = `tel:${this.owner.phone_number}`
    },

    sendEmail () {
      window.location = `mailto:${this.owner.email}`
    },

    updateStatus (newStatus) {
      newStatus = newStatus.replace(/ /g, '_').toUpperCase()

      // save current status in case request fails but set the tool status assuming it will succeed
      let currentStatus = this.getTool.status
      this.getTool.status = newStatus

      // TODO: figure out why api chokes on its own dates
      let datePurchased = this.getTool.date_purchased.replace(/\(.*\)/g, '')

      this.$apollo
        .mutate({
          mutation: gql`
            mutation update($tool: UpdatedTool!) {
              updateTool(updatedTool: $tool) {
                status
              }
            }
          `,
          variables: {
            tool: {
              id: this.getTool.id,
              type_id: this.getTool.type.id,
              brand_id: this.getTool.brand.id,
              model_number: this.getTool.model_number,
              serial_number: this.getTool.serial_number,
              status: newStatus,
              purchased_from_id: this.getTool.purchased_from.id,
              date_purchased: datePurchased,
              owner_id: this.owner.id,
              photo: this.getTool.photo,
              price: this.getTool.price,
              year: this.getTool.year
            }
          }
        })
        .then(status => {
          this.getTool.status = status.data.updateTool.status
        }).catch(() => {
          this.getTool.status = currentStatus
          // TODO: pop toast notifying user that request failed.
        })
    }
  }
}
</script>

<style lang="scss">
@import "../styles/variables";

.tool-detail-page {
  background-color: $background-light-gray;
  display: flex;
  flex-direction: column;

  .header {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 12px;
    background-color: white;
    border-radius: 0px 0px 7px 7px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.16);
    color: $dark-text;
    position: relative;
    z-index: 1;
    flex-shrink: 0;

    .backarrow {
      position: absolute;
      top: 9px;
      left: 23px;
      color: $renascent-red;
      font-size: 30px;
      width: 27px;
      z-index: -10;
    }

    .toolid {
      display: flex;
      flex: 1 0 auto;
      font-size: 25px;
      font-weight: 600;
      justify-content: center;
      padding-top: 9px;
      margin-left: auto;
      margin-right: auto;
    }

    .name {
      font-size: 33px;
      font-weight: 900;
      text-align: center;
      margin-top: 4px;
    }

    .input-group-container {
      width: 300px;
      margin-left: auto;
      margin-right: auto;

      .dropdown-toggle {
        margin: 10px;
      }
    }

    .actions {
      display: flex;
      flex: 0 1 auto;
      justify-content: space-around;
      margin-top: 10px;

      .action-btn {
        background-color: $renascent-red;
        height: 43px;
        width: 154px;
        border: none !important;
        border-radius: 5px;
        color: white;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        padding: 0px;
        display: flex;
        align-content: center;
        // z-index: -10;

        .action-icon {
          font-size: 18px;
          padding-left: 12px;
          float: left;
          margin-top: auto;
          margin-bottom: auto;
        }

        .action-title {
          font-size: 13px;
          flex: 1 0 auto;
          margin-top: auto;
          margin-bottom: auto;
        }
      }
    }
  }

  .cards {
    overflow-y: auto;

    .card {
      position: relative;
      width: calc(100vw - 15px);
      margin-left: auto;
      margin-right: auto;
      background-color: white;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      z-index: 0;
      margin-top: 6px;
      margin-bottom: 10px;
      border-radius: 3px;

      .card-title {
        font-size: 25px;
        font-weight: 900;
        color: $dark-text;
        padding-left: 14px;
        padding-top: 6px;
      }

      .card-details {
        padding-left: 14px;
        padding-right: 14px;
        padding-top: 10px;
      }
    }

    .general-card {
      padding-bottom: 10px;

      .general-details {
        display: flex;
        flex-direction: column;
        font-size: 16px;

        .general-label {
          padding-top: 10px;
          color: $dark-avatar;
          font-weight: 400;
        }

        .general-data {
          color: $dark-text;
          font-weight: 600;
        }
      }
    }

    .photo-card {
      padding-bottom: 11px;

      .photo-box {
        width: calc(100% - 23px);
        margin-left: auto;
        margin-right: auto;
        margin-top: 10px;
        overflow: hidden;

        .image {
          height: 100%;
          width: 100%;
          border-radius: 2px;
        }

        .no-image {
          color: $background-dark-gray;
          font-size: 60px;
          width: 100%;
          text-align: center;
          margin-top: 20px;
          margin-bottom: 20px;
        }
      }
    }

    .owner-card {
      padding-bottom: 17px;

      .owner-details {
        display: flex;
        flex-direction: row;
        align-items: center;

        .owner-name {
          display: flex;
          flex-direction: column;
          font-size: 23px;
          font-weight: 800;
          color: $renascent-dark-gray;
          margin-left: 11px;

          .owner-user {
            display: flex;
            flex-direction: column;
          }
        }

        .user-symbol {
          height: 44px;
          width: 44px;
          border-radius: 50%;
          background-color: $dark-avatar;
          color: white;
          margin: 0px;
          font-size: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
        }
      }

      .contact-buttons {
        margin-left: auto;
        display: flex;
        justify-content: flex-end;
        flex-direction: row;
        flex-wrap: wrap;

        .fab {
          margin: 11px;
        }

        .email-btn {
          margin-left: 11px;
          margin-top: 5px;
          margin-bottom: 5px;
        }

        .call-btn {
          margin-right: 11px;
          margin-bottom: 5px;
          margin-top: 5px;
        }
      }
    }
  }
  .edit {
    position: absolute;
    bottom: 75px;
    right: 20px;
  }
}
</style>
