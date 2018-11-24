<template>
  <div class="page user-detail-page">
    <div class="info-menu-container">
      <div
        class="floating-action-bar">
        <extended-fab
          v-if="$mq === 'desktop'"
          :on-click="transitionToUsers"
          :outline-display="true"
          icon-class="fa-arrow-left"
          class="action-btn transfer-btn"
          button-text="BACK">
        </extended-fab>

        <extended-fab
          v-if="canEdit && $mq === 'desktop'"
          :on-click="toggleEditState"
          :icon-class="editState ? 'fa-save' : 'fa-pen'"
          :disabled="changingRole"
          :button-text="editState ? 'SAVE CHANGES' : 'EDIT USER'">
        </extended-fab>

        <button-dropdown
          v-if="$mq === 'desktop' && isAdmin"
          :on-click="updateRole"
          :options="roles"
          :flag="toggleChangingRole"
          :disabled="editState"
          button-text="CHANGE ROLE">
        </button-dropdown>
      </div>
      <div class="header-cards-container">
        <div class="header">
          <router-link
            v-if="$mq === 'mobile'"
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

          <span
            class="user-role">
            {{ getUser.role }}
          </span>

          <div
            v-if="isAdmin"
            class="actions">
            <button-dropdown
              v-if="$mq === 'mobile' && isAdmin"
              :on-click="updateRole"
              :options="roles"
              button-text="CHANGE ROLE">
            </button-dropdown>
          </div>
        </div>
        <div class="cards">
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
                    {{ formattedPhone }}
                  </button>
                  <input
                    v-validate="{required: true, numeric: true, min: 10}"
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
      </div>
    </div>
    <fab
      v-if="canEdit && $mq === 'mobile'"
      :on-click="toggleEditState"
      :icon-class="editState ? 'fa-save' : 'fa-pen'"
      class="edit"></fab>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import Fab from '../components/fab'
import ExtendedFab from '../components/extended-fab'
import ButtonDropdown from '../components/button-dropdown'
import Roles from '../utils/roles'
import PhoneNumberFormatter from 'phone-number-formats'

export default {
  name: 'ToolDetail',

  components: {
    Fab,
    ExtendedFab,
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
      }
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
      newEmail: '',
      changingRole: false
    }
  },

  computed: {
    isAdmin () {
      return (
        JSON.parse(window.localStorage.getItem('currentUser')).role ===
        Roles.ADMIN
      )
    },

    canEdit () {
      return (
        this.isAdmin ||
        JSON.parse(window.localStorage.getItem('currentUser')).id ===
          this.getUser.id
      )
    },

    formattedPhone () {
      if (this.getUser && this.getUser.phone_number) {
        return new PhoneNumberFormatter(this.getUser.phone_number).format({
          type: 'domestic'
        }).string
      }
    }
  },

  methods: {
    toggleChangingRole () {
      this.changingRole = !this.changingRole
    },
    transitionToUsers () {
      this.$router.push({ name: 'users' })
    },

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
          this.$apollo
            .mutate({
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
                }
              `,

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
            })
            .then(result => {
              if (result) {
                this.$apollo.queries.getUser.refetch()
                this.editState = false
              }
            })
        }
      })
    },

    updateRole (newRole) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation updateStatus($user: UpdatedUser!) {
              updateUser(updatedUser: $user) {
                role
              }
            }
          `,

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
        .then(result => {
          if (result) {
            this.$apollo.queries.getUser.refetch()
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

  .info-menu-container {
    height: 100%;
    background-color: $background-light-gray;

    .error-container {
      height: auto;
      padding-left: 10px;
      color: $renascent-red;
      font-size: 14px;
    }

    .header-cards-container {
      height: 100%;
      overflow-y: hidden;
      display: flex;
      flex-direction: column;

      .header {
        display: flex;
        flex-direction: column;
        background-color: white;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.16);
        color: $dark-text;
        position: relative;
        z-index: 1;
        flex-shrink: 0;

        .user-role {
          text-align: center;
          margin-left: auto;
          margin-right: auto;
          z-index: 4;
        }

        .name {
          font-size: 33px;
          font-weight: 900;
          text-align: center;
          margin-top: 4px;
          z-index: 4;
        }

        #backarrow {
          position: absolute;
          top: 9px;
          left: 23px;
          color: $renascent-red;
          font-size: 30px;
          z-index: -10;
        }

        .actions {
          display: flex;
          margin-top: 10px;
          align-items: center;
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
      }

      .cards {
        overflow-y: auto;

        .card {
          position: relative;
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
                width: 100%;
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
  }
  .edit {
    position: absolute;
    bottom: 75px;
    right: 20px;
  }
}

// MOBILE

.mobile {
  .header {
    width: 100%;
    padding-bottom: 12px;
    border-radius: 0px 0px 7px 7px;
  }

  .cards {
    .card {
      width: calc(100vw - 15px);
    }
  }
}

// DESKTOP
.desktop {
  .info-menu-container {
    display: flex;
    flex-direction: row;
    overflow: hidden;

    .floating-action-bar {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      max-width: 300px;
      flex: 1 1;
      padding-top: 80px;
      overflow-y: auto;

      .container,
      .extended-fab {
        margin-left: 10px;
        margin-top: 20px;
      }
    }

    .header {
      width: 500px;
      padding: 0px;
      border-radius: 3px 3px 3px 3px;
      margin-left: 28px;
      margin-right: 28px;
      margin-top: 10px;
      padding-bottom: 12px;

      .name-inputs {
        display: flex;
        width: 400px;
        height: 44px;

        .name {
          height: 39px;
        }
      }

      .actions {
        justify-content: center;

        .action-btn {
          margin-left: 10px;
          margin-right: 10px;
        }
      }
    }
    .cards {
      .card {
        width: 500px;
      }
    }
  }
}
</style>
