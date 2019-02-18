<template>
  <div class="page new-user-page">
    <header-card
      title="New User"
      exit-link="/users"
    ></header-card>

    <transition name="card-change">
      <div
        v-if="currentState === 1"
        class="new-user-input-card"
      >
        <div class="input-group-container">
          <input
            v-model="firstName"
            v-validate="'required'"
            name="first name"
            class="light-input"
            placeholder="First Name"
            type="string"
          >

          <div class="error-container">
            <span
              v-show="errors.has('first name')"
              class="error"
            >
              {{ errors.first('first name') }}
            </span>
          </div>
        </div>
        <div class="input-group-container">
          <input
            v-model="lastName"
            v-validate="'required'"
            name="last name"
            class="light-input"
            placeholder="Last Name"
            type="string"
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
        <div class="input-group-container">
          <input
            v-model="email"
            v-validate="'email|required'"
            data-vv-as="email"
            name="email"
            class="light-input"
            placeholder="Email"
            type="string"
          >

          <div class="error-container">
            <span
              v-show="errors.has('email')"
              class="error"
            >
              {{ errors.first('email') }}
            </span>
          </div>
        </div>
        <div class="input-group-container">
          <input
            v-model="phoneNumber"
            v-validate="{ required: true, numeric: true, min: 10 }"
            name="phone number"
            class="light-input"
            placeholder="Phone #"
            type="number"
            inputmode="numeric"
            pattern="[0-9]*"
          >

          <div class="error-container">
            <span
              v-show="errors.has('phone number')"
              class="error"
            >
              {{ errors.first('phone number') }}
            </span>
          </div>
        </div>
      </div>
    </transition>

    <transition name="card-change">
      <div
        v-if="currentState === 2"
        class="new-user-input-card"
      >
        <div class="input-group-container">
          <v-select
            v-model="role"
            v-validate:role="'required'"
            :options="roles"
            :filterable="false"
            label="name"
            class="dark-input"
            placeholder="Role"
            name="role"
          >
          </v-select>

          <div class="error-container">
            <span
              v-show="errors.has('role')"
              class="error"
            >
              {{ errors.first('role') }}
            </span>
          </div>
        </div>

        <div class="input-group-container">
          <input
            v-model="firstPassword"
            v-validate="'required'"
            name="first password"
            class="light-input"
            placeholder="Password"
            type="password"
          >

          <div class="error-container">
            <span
              v-show="errors.has('first password')"
              class="error"
            >
              {{ errors.first('first password') }}
            </span>
          </div>
        </div>

        <div class="input-group-container">
          <input
            v-model="secondPassword"
            v-validate="{ required: true, is: firstPassword }"
            name="second password"
            class="light-input"
            placeholder="Re-Enter Password"
            type="password"
          >

          <div class="error-container">
            <span
              v-show="errors.has('second password')"
              class="error"
            >
              {{ errors.first('second password') }}
            </span>
          </div>
        </div>
      </div>
      <user-search-result
        v-if="currentState === 3"
        :user="getUser"
        :on-select="transitionToUserInfo"
        class="user-preview"
      >
      </user-search-result>
    </transition>

    <transition name="card-change">
      <div
        v-if="currentState !== 3"
        class="pager-container"
      >
        <fab
          :disabled="currentState === 1"
          :on-click="() => --currentState"
          class="page-back"
          icon-class="fa-arrow-left"
        >
        </fab>

        <div class="pager">
          <div
            :class="{ selected: currentState === 1 }"
            class="pager-page"
          >
          </div>
          <div
            :class="{ selected: currentState === 2 }"
            class="pager-page"
          >
          </div>
          <div
            :class="{ selected: currentState === 3 }"
            class="pager-page"
          >
          </div>
        </div>

        <fab
          :disabled="!!errors.items.length"
          :on-click="advanceStep"
          class="page-forward"
          icon-class="fa-arrow-right"
        >
        </fab>
      </div>

      <div
        v-if="currentState === 3"
        class="actions"
      >
        <extended-fab
          :on-click="transitionToUsers"
          icon-class="fa-arrow-right"
          button-text="DONE"
        ></extended-fab>
      </div>
    </transition>
  </div>
</template>

<script>
import HeaderCard from '../components/header-card'
import UserSearchResult from '../components/user-search-result.vue'
import ExtendedFab from '../components/extended-fab.vue'
import Fab from '../components/fab'
import vSelect from '../components/select'
import Roles from '../utils/roles'
import swal from 'sweetalert2'
import gql from 'graphql-tag'

export default {
  name: 'NewTool',

  components: {
    HeaderCard,
    UserSearchResult,
    ExtendedFab,
    vSelect,
    Fab
  },

  data () {
    return {
      firstName: null,
      lastName: null,
      email: null,
      phoneNumber: null,
      role: null,
      currentState: 1,
      firstPassword: null,
      secondPassword: null,
      getUser: {}
    }
  },

  computed: {
    roles () {
      return [
        {
          name: 'User',
          id: Roles.USER
        },
        {
          name: 'Administrator',
          id: Roles.ADMIN
        }
      ]
    }
  },

  methods: {
    advanceStep () {
      this.$validator.validate().then(result => {
        if (result) {
          if (this.currentState === 2) {
            this.saveUser()
          } else {
            ++this.currentState
          }
        }
      })
    },

    transitionToUserInfo (userId) {
      this.$router.push({ name: 'userDetail', params: { userId } })
    },

    transitionToUsers () {
      this.$router.push({ name: 'users' })
    },

    saveUser () {
      this.$apollo.mutate({
        mutation: gql`
          mutation createUser($newUser: NewUser!){
          createUser(newUser: $newUser) {
              id,
              first_name,
              last_name,
              role
            }
          }`,

        variables: {
          newUser: {
            first_name: this.firstName,
            last_name: this.lastName,
            email: this.email,
            phone_number: this.phoneNumber,
            password: this.secondPassword,
            role: this.role.id,
            status: 'ACTIVE'
          }
        },
        refetchQueries: [{
          query: gql`
            query {
              getAllUser {
                id
                first_name
                last_name
                role
              }
            }
          `
        }]
      }).then(result => {
        ++this.currentState
        this.getUser = result.data.createUser
      }).catch(() => {
        this.resetData()
        this.currentState = 1
        swal({
          type: 'error',
          title: 'ERROR',
          text: 'There was an error creating the user. Please try again.',
          timer: 2000,
          showConfirmButton: false
        })
      })
    },

    resetData () {
      this.firstName = null
      this.lastName = null
      this.email = null
      this.phoneNumber = null
      this.role = null
      this.firstPassword = null
      this.secondPassword = null
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

  .card-change-enter-active {
    transition: opacity .25s;
  }

  .card-change-leave-active,
  .card-change-leave-to {
    display: none;
    visibility: hidden;
  }

  .card-change-enter {
    opacity: 0;
  }

  .new-user-page {
    display: flex;
    flex-direction: column;
    background-color: $background-light-gray;

    .user-preview {
      margin-top: auto;
    }

    .new-user-input-card {
      display: flex;
      flex: 1 0 434px;
      max-height: 465px;
      flex-direction: column;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      margin: 10px 10px 0 10px;
      background-color: white;
      align-items: center;
      justify-content: space-around;
      padding: 0 20px;
      border-radius: 3px;

      .input-group-container {
        display: flex;
        flex-direction: column;
        width: 100%;

        .error-container {
          height: 19px;
          padding-left: 10px;
          color: $renascent-red;
          font-size: 14px;
        }
      }
    }

    .pager-container {
      display: flex;
      flex: 0 0 90px;
      justify-content: space-around;
      align-items: center;

      .pager {
        display: flex;
        justify-content: space-between;
        flex: 0 0 70px;

        .pager-page {
          padding: 0;
          height: 10px;
          width: 10px;
          border-radius: 50%;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          background-color: white;

          &.selected {
            background-color: $renascent-dark-gray;
          }
        }
      }
    }

    .actions {
      margin-top: auto;
      padding: 18px;
      margin-left: auto;
      margin-right: auto;
    }
  }

// DESKTOP

.desktop {
  .header-card {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    border-radius: 0;
    margin-bottom: 10px;
  }

  .new-user-input-card {
    padding-top: 5px;
    width: 400px;
    margin-left: auto;
    margin-right: auto;
    max-height: 400px;
    margin-top: auto;
    margin-bottom: auto;

    * {
      font-size: 16px;
    }

    .dark-input, .light-input, .popover-container {
      height: 45px !important;
      margin-left: auto;
      margin-right: auto;
      width: 350px;
    }
  }

  .user-preview {
    margin-left: auto;
    margin-right: auto;
    width: 500px;
  }
}
</style>
