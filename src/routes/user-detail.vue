<template>
  <div class="page user-detail-page">
    <div id="header">
      <router-link
        id="backarrow"
        class="fas fa-arrow-left"
        to="/users/"> </router-link>

      <span id="userid"> #{{ getUser.id }} </span>

      <div
        v-if="!editState"
        class="name">
        {{ getUser.first_name }} {{ getUser.last_name }}
      </div>

      <div
        v-if="editState"
        class="name-inputs">
        <input
          v-validate="'required'"
          v-model="newFirstName"
          name="first name"
          class="name light-input"
          value="`${getUser.first_name}">
        <div class="error-container">
          <span
            v-show="errors.has('first name')"
            class="error">
            {{ errors.first('first name') }}
          </span>
        </div>
        <input
          v-validate="'required'"
          v-model="newLastName"
          class="name light-input"
          name="last name"
          value="getUser.last_name">
        <div class="error-container">
          <span
            v-show="errors.has('last name')"
            class="error">
            {{ errors.first('last name') }}
          </span>
        </div>
      </div>

      <div
        v-if="isAdmin"
        id="actions">
        <button-dropdown
          :on-click="updateRole"
          :options="roles"
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
        <div class="error-container">
          <span
            v-show="errors.has('phone')"
            class="error">
            {{ errors.first('phone') }}
          </span>
        </div>
        <div class="card-details contact-details">
          <div class="contact-buttons">
            <div class="contact-item">
              <fab
                id="call-btn"
                :on-click="phoneNumber() ? phoneCall : () => 0"
                :active="!phoneNumber()"
                icon-class="fa-phone">
              </fab>

              <button
                v-if="!editState"
                class="contact-text"
                @click="phoneNumber() ? phoneCall() : () => 0">
                {{ getUser.phone_number }}
              </button>
              <input
                v-validate="{required: true, numeric: true, min: 7}"
                v-if="editState"
                v-model="newPhone"
                name="phone"
                class="contact-text light-input"
                value="getUser.phone_number"
                type="number">
            </div>

            <div class="contact-item">
              <fab
                id="email-btn"
                :on-click="email() ? sendEmail : () => 0"
                :active="!email()"
                icon-class="fa-envelope"
                type="string">
              </fab>

              <button
                v-if="!editState"
                class="contact-text"
                @click="email() ? sendEmail() : () => 0">
                {{ getUser.email }}
              </button>
              <input
                v-validate="'required|email'"
                v-if="editState"
                v-model="newEmail"
                name="email"
                class="contact-text light-input"
                value="getUser.email">
            </div>
          </div>
        </div>
        <div class="error-container">
          <span
            v-show="errors.has('email')"
            class="error">
            {{ errors.first('email') }}
          </span>
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
import Fab from '../components/fab'
import ButtonDropdown from '../components/button-dropdown'
import Roles from '../utils/roles'

export default {
  name: 'ToolDetail',

  components: {
    Fab,
    ButtonDropdown
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
      variables () {
        let options = {}
        options.user_id = this.$router.currentRoute.params.userId
        return options
      },

      fetchPolicy: 'cache-and-network'
    }
  },

  data () {
    return {
      getUser: {},
      roles: Object.values(Roles),
      editState: false,
      newFirstName: '',
      newLastName: '',
      newPhone: '',
      newEmail: ''
    }
  },

  computed: {
    isAdmin () {
      return JSON.parse(window.localStorage.getItem('currentUser')).role === Roles.ADMIN
    },

    canEdit () {
      return this.isAdmin || JSON.parse(window.localStorage.getItem('currentUser')).id === this.getUser.id
    }
  },

  methods: {
    toggleEditState () {
      if (this.editState) {
        this.saveUser()
      } else {
        this.newFirstName = this.getUser.first_name
        this.newLastName = this.getUser.last_name
        this.newPhone = this.getUser.phone_number
        this.newEmail = this.getUser.email
        this.editState = true
      }
    },

    saveUser () {
      this.$validator.validate().then(result => {
        if (result) {
          this.$apollo.mutate({
            mutation: gql`
              mutation updateStatus($user: UpdatedUser!) {
                updateUser(updatedUser: $user) {
                  id
                  first_name
                  last_name
                  email
                  phone_number
                  role
                  status
                }
              }`,

            variables: {
              user: {
                id: this.getUser.id,
                first_name: this.newFirstName,
                last_name: this.newLastName,
                email: this.newEmail,
                phone_number: this.newPhone,
                role: this.getUser.role,
                status: this.getUser.status
              }
            }
          }).then(result => {
            if (result) {
              this.$apollo.queries.getUser.refresh()
              this.editState = false
            }
          })
        }
      })
    },

    updateRole (newRole) {
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

    phoneNumber () {
      return this.getUser.phone_number || null
    },

    email () {
      return this.getUser.email || null
    },

    phoneCall () {
      window.location.href = `tel:${this.getUser.phone_number}`
    },

    sendEmail () {
      window.location = `mailto:${this.getUser.email}`
    }
  }
}
</script>

<style lang="scss">
@import "../styles/variables";

.user-detail-page {
  background-color: $background-light-gray;
  display: flex;
  flex-direction: column;

  .error-container {
    height: auto;
    padding-left: 10px;
    color: $renascent-red;
    font-size: 14px;
  }

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

    .name-inputs {
      margin-left: auto;
      margin-right: auto;
      width: 300px;
    }

    .name {
      font-size: 33px;
      font-weight: 900;
      text-align: center;
      margin-top: 4px;
      margin-left: auto;
      margin-right: auto;
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

      .error-container {
        position: absolute;
        right: 10px;
        padding-bottom: 10px;
      }

      .contact-details {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .contact-buttons {
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        width: 100%;

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
            width: 100%
          }

          .fab {
            margin: 11px;
            flex: 0 0 auto;
          }
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
