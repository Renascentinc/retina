<template>
  <div class="page tool-detail-page">
    <div id="header">
      <router-link
        id="backarrow"
        class="fas fa-arrow-left"
        to="/tools"/>

      <span id="toolid">#{{ getTool.id }} </span>
      <div id="name">
        {{ getTool.brand.name }} {{ getTool.type.name }}
      </div>

      <div
        id="actions"
        v-if="isTransferable()">
        <button-dropdown
          :on-click="updateStatus"
          :options="['AVAILABLE', 'IN USE', 'MAINTENANCE', 'OUT OF SERVICE']"
          :button-text="`${ formattedStatus(getTool.status) }`"/>

        <button
          class="action-btn">
          <i class="fas fa-exchange-alt action-icon"/>
          <span class="action-title">TRANSFER</span>
        </button>
      </div>
    </div>
    <div id="cards">
      <div
        id="owner-card"
        class="card">
        <div class="card-title">
          Owner
        </div>
        <div class="card-details owner-details">
          <div class="user-symbol">
            <i
              v-if="getTool.user"
              class="fas fa-user"/>
            <i
              v-if="getTool.location"
              class="fas fa-map-marker-alt"/>
          </div>
          <div id="owner-name">
            <div
              v-if="getTool.location"
              id="owner-location">
              {{ getTool.location.name }}
            </div>
            <div
              v-if="getTool.user"
              id="owner-user">
              <span> {{ getTool.user.first_name }} </span>
              <span> {{ getTool.user.last_name }} </span>
            </div>
          </div>
          <div class="contact-buttons">
            <fab
              id="call-btn"
              :on-click="phoneNumber() ? phoneCall : () => 0"
              :active="phoneNumber"
              icon-class="fa-phone"/>

            <div class="spacer"/>

            <fab
              id="email-btn"
              :on-click="email() ? sendEmail : () => 0"
              :active="email"
              icon-class="fa-envelope"/>
          </div>
        </div>
      </div>
      <div
        id="general-card"
        class="card">
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
          <span class="general-data"> {{ getTool.purchased_from.name || '-' }} </span>

          <span class="general-label">Purchase Date</span>
          <span class="general-data"> {{ formattedDate(getTool.date_purchased) || '-' }} </span>

          <span class="general-label">Purchase Price</span>
          <span class="general-data"> ${{ formattedPrice(getTool.price) || ' -' }} </span>
        </div>

      </div>

      <div
        id="photo-card"
        class="card">
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
            id="no-image"
            class="fas fa-image"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import Avatar from 'vue-avatar'
import Fab from '../components/fab.vue'
import VueLazyload from 'vue-lazyload'
import ButtonDropdown from '../components/button-dropdown.vue'

export default {
  name: 'ToolDetail',

  components: {
    Avatar,
    Fab,
    ButtonDropdown,
    VueLazyload
  },

  apollo: {
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

            location {
              id
              name
            }

            user {
              id
              first_name
              last_name
              email
              phone_number
            }
          }
        }
      `,
      variables () {
        let options = {}
        options.tool_id = this.$router.currentRoute.params.toolId
        return options
      }
    }
  },

  data () {
    return {
      getTool: {},
      window: window
    }
  },

  methods: {
    isTransferable () {
      if (this.getTool.location) {
        return true
      } else if (JSON.parse(window.localStorage.getItem('currentUser')).id === this.getTool.user.id) {
        return true
      } else if (JSON.parse(window.localStorage.getItem('currentUser')).role === "ADMINISTRATOR") {
        return true
      }
      return false
    },

    phoneNumber () {
      if (this.getTool.user) {
        return this.getTool.user.phone_number
      } else if (this.getTool.location) {
        return this.getTool.location.phone_number
      }
    },

    email () {
      if (this.getTool.user) {
        return this.getTool.user.email
      } else if (this.getTool.location) {
        return this.getTool.location.email
      }
    },

    formattedStatus (status) {
      return status.replace(/_/g, ' ').toUpperCase()
    },

    phoneCall () {
      window.location.href = `tel:${this.getTool.user.phone_number}`
    },

    sendEmail () {
      window.location = `mailto:${this.getTool.user.email}`
    },

    updateStatus (newStatus) {
      newStatus = newStatus.replace(/ /g, '_').toUpperCase()
      var datePurchased = this.getTool.date_purchased.replace(/\(.*\)/g, '')

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
              user_id: this.getTool.user && this.getTool.user.id,
              location_id: this.getTool.location && this.getTool.location.id,
              photo: this.getTool.photo,
              price: this.getTool.price,
              year: this.getTool.year
            }
          }
        })
        .then(status => {
          this.getTool.status = status.data.updateTool.status
        })
    },

    formattedDate (dateString) {
      if (dateString) {
        return new Date(dateString).toLocaleDateString('en-US')
      }

      return null
    },

    formattedPrice (priceString) {
      if (priceString) {
        return `${priceString / 100}`
      }

      return null
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

  #header {
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

    #backarrow {
      position: absolute;
      top: 9px;
      left: 23px;
      color: $renascent-red;
      font-size: 30px;
      z-index: -10;
    }

    #toolid {
      display: flex;
      flex: 1 0 auto;
      font-size: 25px;
      font-weight: 600;
      justify-content: center;
      padding-top: 9px;
      margin-right: auto;
      margin-left: auto;
    }

    #name {
      font-size: 33px;
      font-weight: 900;
      text-align: center;
      margin-top: 4px;
    }

    #actions {
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
        z-index: -10;

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

  #cards {
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

    #general-card {
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

    #photo-card {
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

        #no-image {
          color: $background-dark-gray;
          font-size: 60px;
          width: 100%;
          text-align: center;
          margin-top: 20px;
          margin-bottom: 20px;
        }
      }
    }

    #owner-card {
      padding-bottom: 17px;

      .owner-details {
        display: flex;
        flex-direction: row;
        align-items: center;

        #owner-name {
          display: flex;
          flex-direction: column;
          font-size: 23px;
          font-weight: 800;
          color: $renascent-dark-gray;
          margin-left: 11px;

          #owner-user {
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

        #email-btn {
          margin-left: 11px;
          margin-top: 5px;
          margin-bottom: 5px;
        }

        #call-btn {
          margin-right: 11px;
          margin-bottom: 5px;
          margin-top: 5px;
        }
      }
    }
  }
}
</style>
