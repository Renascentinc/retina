<template>
  <div class="page user-detail-page">
    <div id="header">
      <router-link
        id="backarrow"
        class="fas fa-arrow-left"
        to="/users/"> </router-link>

      <span id="userid"> #{{ getUser.id }} </span>

      <div id="name">
        {{ getUser.first_name }} {{ getUser.last_name }}
      </div>

      <div
        id="actions"
        v-if="isAdmin()">
        <button-dropdown
          :on-click="updateRole"
          :options="['ADMINISTRATOR', 'USER']"
          :button-text="`${ getUser.role }`"/>
      </div>
    </div>
    <div id="cards">
      <div
        id="contact-card"
        class="card">
        <div class="card-title">
          Contact
        </div>
        <div class="card-details contact-details">
          <div class="contact-buttons">
            <div class="contact-item">
              <fab
                id="call-btn"
                :on-click="phoneNumber() ? phoneCall : () => 0"
                :active="phoneNumber"
                icon-class="fa-phone"/>

                <button
                  class="contact-text"
                  @click="phoneNumber() ? phoneCall() : () => 0"> {{ getUser.phone_number }} </button>
            </div>

            <div class="contact-item">
              <fab
                id="email-btn"
                :on-click="email() ? sendEmail : () => 0"
                :active="email"
                icon-class="fa-envelope"/>

              <button
                class="contact-text"
                @click="email() ? sendEmail() : () => 0"> {{ getUser.email }} </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import Fab from "../components/fab.vue";
import ButtonDropdown from "../components/button-dropdown.vue";

export default {
  name: "ToolDetail",

  components: {
    Fab,
    ButtonDropdown,
  },

  apollo: {
    getUser: {
      query: gql`
        query users($user_id: ID!) {
          getUser(user_id: $user_id) {
            id
            first_name
            last_name
            email
            phone_number
            role
            status
          }
        }
      `,
      variables() {
        let options = {};
        options.user_id = this.$router.currentRoute.params.userId;
        return options;
      }
    }
  },

  data() {
    return {
      getUser: {},
      window: window
    };
  },

  methods: {
    updateRole(newRole) {
      this.$apollo.mutate({
        mutation: gql`
          mutation updateStatus($user: UpdatedUser!) {
            updateUser(updatedUser: $user) {
              role
            }
          }`,

          variables: {
            user: {
              id: this.getUser.id,
              first_name: this.getUser.first_name,
              last_name: this.getUser.last_name,
              email: this.getUser.email,
              phone_number: this.getUser.phone_number,
              role: newRole,
              status: this.getUser.status
            }
          }
      })
    },

    isAdmin() {
      return JSON.parse(window.localStorage.getItem("currentUser")).role === "ADMINISTRATOR"
    },

    phoneNumber() {
      return this.getUser.phone_number || null
    },

    email() {
      return this.getUser.email || null
    },

    phoneCall() {
      window.location.href = `tel:${this.getUser.phone_number}`;
    },

    sendEmail() {
      window.location = `mailto:${this.getUser.email}`;
    }
  }
};
</script>

<style lang="scss">
@import "../styles/variables";

.user-detail-page {
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

    #userid {
      display: flex;
      flex: 1 0 auto;
      font-size: 25px;
      font-weight: 600;
      justify-content: center;
      padding-top: 9px;
      margin-left: auto;
      margin-right: auto;
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

    #contact-card {
      padding-bottom: 17px;

      .contact-details {
        display: flex;
        flex-direction: row;
        align-items: center;

        #name {
          display: flex;
          flex-direction: column;
          font-size: 23px;
          font-weight: 800;
          color: $renascent-dark-gray;
          margin-left: 11px;
        }
      }

      .contact-buttons {
        display: flex;
        justify-content: flex-start;
        flex-direction: column;

        .contact-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          vertical-align: middle;

          .contact-text {
            cursor: pointer;
            display: flex;
            flex-wrap: wrap;
            word-break: break-all;
            font-weight: 700;
            color: $renascent-dark-gray;
            font-size: 16px;
          }

          .fab {
            margin: 11px;
            flex: 0 0 auto;
          }
        }
      }
    }
  }
}
</style>
