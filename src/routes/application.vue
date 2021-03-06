<template>
  <div
    :class="$mq"
    class="main-application"
  >
    <vue-drawer-layout
      ref="drawer"
      :drawer-width="270"
      :content-drawable="false"
      @mask-click="closeDrawer"
    >
      <div
        slot="drawer"
        class="drawer-content"
      >
        <div class="account-info">
          <avatar :username="currentUser.name"></avatar>
          <span class="username">
            <span> {{ currentUser.first_name }} </span>
            <span> {{ currentUser.last_name }} </span>
          </span>
          <span class="role">
            {{ currentUser.role }}
          </span>
          <span class="email">
            {{ currentUser.email }}
          </span>
          <hr class="line">
        </div>

        <div class="menu-buttons">
          <button
            v-if="isAdminUser"
            class="config menu-btn"
            @click="transitionToConfig"
          >
            <i class="fas menu-btn-icon fa-cog"></i>
            CONFIGURATION
          </button>
          <button
            class="help menu-btn"
            @click="sendSupportEmail"
          >
            <i class="fas menu-btn-icon fa-question-circle"></i>
            CONTACT SUPPORT
          </button>
          <button
            class="change-password menu-btn"
            @click="changePassword"
          >
            <span>
              <i class="fas menu-btn-icon fa-key"></i>
              CHANGE PASSWORD
            </span>
          </button>
          <button
            class="sign-out menu-btn"
            @click="logout"
          >
            <i class="fas menu-btn-icon fa-sign-out-alt"></i>
            SIGN OUT
          </button>
        </div>

        <div class="app-version">
          {{ appVersion }}
        </div>
      </div>

      <div
        slot="content"
        class="main-content"
      >
        <transition name="page-change">
          <router-view></router-view>
        </transition>

        <div
          class="nav-bar"
        >
          <div class="icon-text-container">
            <button
              class="fas fa-bars menu-icon"
              @click="openDrawer"
            >
              <span class="icon-subtext">
                MENU
              </span>
            </button>
          </div>

          <div class="icon-text-container">
            <router-link
              class="fas fa-toolbox menu-icon"
              to="/tools"
            >
              <span class="icon-subtext">
                TOOLS
              </span>
            </router-link>
          </div>

          <div class="icon-text-container">
            <router-link
              class="fas fa-book-open menu-icon"
              to="/history"
            >
              <span class="icon-subtext">
                HISTORY
              </span>
            </router-link>
          </div>

          <div class="icon-text-container">
            <router-link
              class="fas fa-users menu-icon"
              to="/users"
            >
              <span class="icon-subtext">
                USERS
              </span>
            </router-link>
          </div>
        </div>
      </div>
    </vue-drawer-layout>
  </div>
</template>

<script>
import Vue from 'vue'
import { handleCommonErrors } from '@/utils/api-response-errors'
import Avatar from 'vue-avatar'
import gql from 'graphql-tag'
import nfcMixin from '@/mixins/nfc'
import Platforms from '@/utils/platforms'
import swal from 'sweetalert2'
import { mapGetters, mapActions, mapState } from 'vuex'
import store from '@/store'
import pkg from '../../package.json'

export default {
  name: 'Application',

  components: {
    Avatar
  },

  mixins: [ nfcMixin ],

  data () {
    return {
      passwordResetLoading: false
    }
  },

  computed: {
    ...mapState('auth', [
      'currentUser'
    ]),

    ...mapGetters('auth', [
      'isAdminUser',
      'isAuthenticated'
    ]),

    appVersion () {
      return `RETINA v${pkg.version}`
    }
  },

  mounted () {
    if (this.checkIsNfcEnabled() && window.device.platform === Platforms.ANDROID) {
      // add a noop nfc listener to keep nfc scans on android from bubbling up to the OS
      window.nfc.addNdefListener(() => 0)
    }
  },

  methods: {
    ...mapActions('auth', [
      'logout'
    ]),

    transitionToConfig () {
      this.$router.push({ name: 'configuration' })
      this.closeDrawer()
    },

    sendSupportEmail () {
      window.location.href = 'mailto:retinasupport@renascentinc.com'
    },

    closeDrawer () {
      this.$refs.drawer.toggle(false)
    },

    openDrawer () {
      this.$refs.drawer.toggle(true)
    },

    changePassword () {
      swal({
        title: 'CHANGE PASSWORD',
        html:
          '<input id="current-password" type="password" class="swal2-input" placeholder="Current Password">' +
          '<input id="password" type="password" class="swal2-input" placeholder="New Password">' +
          '<input id="confirm-password" type="password" class="swal2-input" placeholder="Confirm New Password">',
        focusConfirm: true,
        showCancelButton: true,
        confirmButtonText: 'RESET',
        cancelButtonText: 'CANCEL',
        confirmButtonColor: '#404040',
        reverseButtons: true,
        preConfirm: () => {
          let currentPassword = document.getElementById('current-password')
          let password = document.getElementById('password')
          let confirmPassword = document.getElementById('confirm-password')

          let reset = () => {
            swal.resetValidationMessage()
            currentPassword.classList.remove('error')
            confirmPassword.classList.remove('error')
            password.classList.remove('error')
          }

          if (!currentPassword.value) {
            swal.showValidationMessage('Current Password field is required')
            currentPassword.classList.add('error')
            setTimeout(reset, 3000)
            return false
          }

          if (!password.value) {
            swal.showValidationMessage('New Password field is required')
            password.classList.add('error')
            setTimeout(reset, 3000)
            return false
          }

          if (!confirmPassword.value) {
            swal.showValidationMessage('Confirm New Password field is required')
            confirmPassword.classList.add('error')
            setTimeout(reset, 3000)
            return false
          }

          if (password.value !== confirmPassword.value) {
            swal.showValidationMessage('Passwords do not match')
            password.classList.add('error')
            confirmPassword.classList.add('error')
            setTimeout(reset, 3000)
            return false
          }

          return [
            currentPassword.value,
            password.value
          ]
        }
      }).then(result => {
        if (result.dismiss) {
          return
        }

        let [currentPassword, newPassword] = result.value

        this.$apollo.mutate({
          mutation: gql`mutation changePassword($current_password: String!, $new_password: String!) {
            updateCurrentUserPassword(current_password: $current_password, new_password: $new_password)
          }`,
          variables: {
            current_password: currentPassword,
            new_password: newPassword
          }
        }).then(({ data: { updateCurrentUserPassword } }) => {
          if (updateCurrentUserPassword) {
            swal({
              type: 'success',
              title: 'SUCCESS',
              text: 'Successfully Changed Password',
              timer: 1500,
              showConfirmButton: false
            })
          } else {
            this.changePassword()
            swal.showValidationMessage('Current Password is invalid')
          }
        }).catch((error) => {
          if (handleCommonErrors(error)) {
            return
          }

          swal({
            type: 'error',
            title: 'ERROR',
            text: 'There was an error changing your password. Please try again or contact support',
            timer: 2000,
            showConfirmButton: false
          })
          Vue.rollbar.error('Error in routes:application:changePassword', error)
        })
      })
    }
  },

  beforeRouteEnter (to, from, next) {
    Vue.nextTick(() => {
      store.getters['auth/isAuthenticated'] ? next() : next('/login')
    })
  }
}
</script>

<style lang="scss">
.menu-btn .loading {
  top: -43px;
}

.error {
  border-color: red !important;
}

.app-version {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  font-size: 12px;
  color: #fff;
  opacity: .25;
}
</style>
