<template>
  <div class="page user-detail-page">
    <div class="info-menu-container">
      <div
        class="action-sidebar"
        v-if="$mq === 'desktop'"
      >
        <extended-fab
          :on-click="transitionToUsers"
          :outline-display="true"
          icon-class="fa-arrow-left"
          class="action-btn transfer-btn"
          button-text="BACK"
        />

        <extended-fab
          v-if="canEdit"
          :on-click="toggleEditState"
          :icon-class="editState ? 'fa-save' : 'fa-pen'"
          :disabled="changingRole"
          :button-text="editState ? 'SAVE CHANGES' : 'EDIT USER'"
        />

        <extended-fab
          v-if="editState"
          :on-click="cancelEdit"
          :disabled="changingRole"
          icon-class="fa-times"
          button-text="CANCEL"
        />

        <dropdown
          v-if="isAdminUser"
          :on-click="updateRole"
          :options="roles"
          :flag="toggleChangingRole"
          :disabled="editState"
          button-text="CHANGE ROLE"
        />
      </div>
      <div class="header-cards-container">
        <div class="header">
          <router-link
            v-if="$mq === 'mobile'"
            id="backarrow"
            class="fas fa-arrow-left"
            to="/users/"
          />

          <span id="userid">
            #{{ user.id }}
          </span>

          <div
            v-if="!editState"
            class="name"
          >
            {{ user.name }}
          </div>

          <div
            v-if="editState"
            class="name-inputs"
          >
            <input
              v-validate="'required'"
              v-model="editedUser.first_name"
              name="first name"
              class="name light-input"
            >
            <div class="error-container">
              <span
                v-show="errors.has('first name')"
                class="error"
              >
                {{ errors.first('first name') }}
              </span>
            </div>
            <input
              v-validate="'required'"
              v-model="editedUser.last_name"
              class="name light-input"
              name="last name"
            >
            <div class="error-container">
              <span
                v-show="errors.has('last name')"
                class="error"
              >
                {{ errors.first('last name') }}
              </span>
            </div>
          </div>

          <span
            class="user-role"
          >
            {{ user.role }}
          </span>

          <div
            v-if="isAdminUser"
            class="actions"
          >
            <dropdown
              v-if="$mq === 'mobile' && isAdminUser"
              :on-click="updateRole"
              :options="roles"
              button-text="CHANGE ROLE"
            />
          </div>
        </div>
        <div class="cards">
          <div
            id="contact-card"
            class="card"
          >
            <div class="card-title">
              Contact
            </div>
            <div class="error-container">
              <span
                v-show="errors.has('phone')"
                class="error"
              >
                {{ errors.first('phone') }}
              </span>
            </div>
            <div class="card-details contact-details">
              <div class="contact-buttons">
                <div class="contact-item">
                  <fab
                    id="call-btn"
                    :on-click="() => user.startPhoneCall()"
                    :active="!user.phone_number"
                    icon-class="fa-phone"
                  />

                  <button
                    v-if="!editState"
                    class="contact-text"
                    @click="() => user.startPhoneCall()"
                  >
                    {{ user.formattedPhoneNumber }}
                  </button>
                  <input
                    v-validate="{required: true, numeric: true, min: 10}"
                    v-if="editState"
                    v-model="editedUser.phone_number"
                    name="phone"
                    class="contact-text light-input"

                    type="number"
                  >
                </div>

                <div class="contact-item">
                  <fab
                    id="email-btn"
                    :on-click="() => user.startEmail()"
                    :active="!user.email"
                    icon-class="fa-envelope"
                    type="string"
                  />

                  <button
                    v-if="!editState"
                    class="contact-text"
                    @click="() => user.startEmail()"
                  >
                    {{ user.email }}
                  </button>
                  <input
                    v-validate="'required|email'"
                    v-if="editState"
                    v-model="editedUser.email"
                    name="email"
                    class="contact-text light-input"
                  >
                </div>
              </div>
            </div>
            <div class="error-container">
              <span
                v-show="errors.has('email')"
                class="error"
              >
                {{ errors.first('email') }}
              </span>
            </div>
          </div>
          <div
            v-if="editState && isAdminUser && !isCurrentUser"
            class="container search-result"
            @click="performUserDelete"
          >
            <div class="default-text">
              <i class="fas fa-times"></i>
              DELETE USER
            </div>
          </div>
        </div>
      </div>
    </div>

    <fab
      v-if="editState && $mq === 'mobile'"
      :on-click="cancelEdit"
      icon-class="fa-times"
      class="cancel"
    />

    <fab
      v-if="canEdit && $mq === 'mobile'"
      :on-click="toggleEditState"
      :icon-class="editState ? 'fa-save' : 'fa-pen'"
      class="edit"
    />
  </div>
</template>

<script>
import Fab from '@/components/basic/fab'
import ExtendedFab from '@/components/basic/extended-fab'
import Dropdown from '@/components/basic/dropdown'
import Roles from '@/utils/roles'
import { getUserById } from '@/utils/gql'
import User from '@/models/user'
import { showInvalidIDMsg, showSuccessMsg, showErrorMsg } from '@/utils/alerts'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'ToolDetail',

  components: {
    Fab,
    ExtendedFab,
    Dropdown
  },

  apollo: {
    getUser: {
      query: getUserById,
      variables () {
        return {
          user_id: this.$router.currentRoute.params.userId
        }
      },
      result (apiResult) {
        let user = apiResult.data.getUser
        if (user) {
          this.user.update(user)
        } else {
          showInvalidIDMsg()
          this.$router.push({ path: '/users' })
        }
      }

    }
  },

  data () {
    return {
      user: new User(),
      editedUser: null,
      roles: Object.values(Roles),
      editState: false,
      changingRole: false
    }
  },

  computed: {
    ...mapState('auth', [
      'currentUser'
    ]),

    ...mapGetters('auth', [
      'isAdminUser'
    ]),

    isCurrentUser () {
      return this.currentUser.id === this.user.id
    },

    canEdit () {
      return this.isAdminUser || this.isCurrentUser
    }
  },

  methods: {
    ...mapActions('users', [
      'updateUser',
      'deleteUser'
    ]),

    toggleChangingRole () {
      this.changingRole = !this.changingRole
    },

    transitionToUsers () {
      this.$router.push({ name: 'users' })
    },

    cancelEdit () {
      this.editState = false
    },

    toggleEditState () {
      if (this.editState) {
        this.saveUser()
      } else {
        this.editedUser = new User(this.user)
        this.editState = true
      }
    },

    async performUserDelete () {
      try {
        await this.deleteUser(this.editedUser)
        showSuccessMsg('Successfully Deleted User')
        this.transitionToUsers()
      } catch (error) {
        showErrorMsg('There was an error saving changes. Please try again or contact support.')
      }
    },

    async saveUser () {
      let isValid = this.$validator.validate()

      if (!isValid) {
        return
      }

      try {
        await this.updateUser(this.editedUser)
        this.user.update(this.editedUser)
        this.editState = false
      } catch (error) {
        showErrorMsg('There was an error saving changes. Please try again or contact support.')
      }
    },

    async updateRole (newRole) {
      this.editedUser = new User(this.user)
      this.editedUser.role = newRole

      try {
        await this.updateUser(this.editedUser)
        this.user.update(this.editedUser)
      } catch (error) {
        showErrorMsg('There was an error saving changes. Please try again or contact support.')
      }
    }
  }
}
</script>

<style lang="scss">
.user-detail-page {
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
    bottom: 70px;
    bottom: calc(70px + constant(safe-area-inset-bottom));
    bottom: calc(70px + env(safe-area-inset-bottom));
    right: 20px;
  }

  .cancel {
    position: absolute;
    bottom: 70px;
    bottom: calc(70px + constant(safe-area-inset-bottom));
    bottom: calc(70px + env(safe-area-inset-bottom));
    right: 80px;
  }
}

.mobile .user-detail-page {
  .actions {
    justify-content: space-around;
  }

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

.desktop .user-detail-page {
  .info-menu-container {
    display: flex;
    flex-direction: row;
    overflow: hidden;

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

    .search-result {
      margin: 10px auto;
    }
  }
}
</style>
