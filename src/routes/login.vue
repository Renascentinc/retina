<template>
  <div
    :class="$mq"
    class="page login-page">
    <div class="top-panel">
      <img
        class="logo"
        src="../assets/icons/web/red_transparent_512x512.png">

      <div class="name-container">
        <span
          class="retina-name">
          RETINA
        </span>
        <span
          class="renascent-name">
          Renascent, Inc.
        </span>
      </div>
    </div>
    <form class="bottom-panel">
      <div class="status-message">
        <transition name="fade">
          <span
            v-if="currentState.show"
            :class="currentState.class">
            {{ currentState.text }}
          </span>
        </transition>
      </div>

      <div class="login-inputs-container">
        <input-with-icon
          class="email-container"
          icon-class="fa-user">
          <input
            v-model="username"
            class="username-input"
            placeholder="username@renascentinc.com"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false">
        </input-with-icon>

        <input-with-icon
          class="password-container"
          icon-class="fa-key">
          <input
            v-model="password"
            class="password-input"
            placeholder="password"
            type="password">
        </input-with-icon>

        <input-with-icon
          :class="{ show: currentState === states.NEED_ORG_NAME }"
          class="organization-container"
          icon-class="fa-building">
          <input
            v-model="organizationName"
            class="org-name-input"
            placeholder="organization name"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false">
        </input-with-icon>
      </div>

      <div class="login-action-row">
        <button
          class="reset-password"
          type="reset"
          @click="() => $modal.show('password-reset-modal')">
          RESET PASSWORD
        </button>

        <extended-fab
          :on-click="attemptUserLogin"
          class="login-btn"
          icon-class="fa-arrow-right"
          button-text="SIGN IN"
          button-type="submit">
        </extended-fab>
      </div>
    </form>

    <modal
      :width="300"
      :height="220"
      class="ready-to-scan-modal"
      name="password-reset-modal">
      <div
        v-if="!loading"
        class="modal-content">
        <span class="header-text"> RESET PASSWORD </span>

        <div class="input-group-container">
          <input
            v-validate="'required|email'"
            v-model="passwordResetEmail"
            name="passwordResetEmail"
            class="light-input password-reset-email-input"
            placeholder="email address">

          <span
            class="error">
            {{ errors.first('passwordResetEmail') }}
          </span>
        </div>

        <div class="request-action-container">
          <extended-fab
            :on-click="() => $modal.hide('password-reset-modal')"
            icon-class=""
            class="request-reset-btn"
            button-text="CANCEL">
          </extended-fab>

          <extended-fab
            :on-click="requestPasswordReset"
            :disabled="!passwordResetEmail"
            icon-class=""
            class="request-reset-btn"
            button-text="SUBMIT">
          </extended-fab>
        </div>
      </div>
      <div
        v-if="loading"
        class="modal-content">
        <div class="loading"></div>
      </div>
    </modal>
  </div>
</template>

<script>

import gql from 'graphql-tag'
import ApiStatusCodes from '../utils/api-status-codes'
import InputWithIcon from '../components/input-with-icon'
import ExtendedFab from '../components/extended-fab'
import VueNotifications from 'vue-notifications'

export default {
  name: 'Login',

  components: {
    InputWithIcon,
    ExtendedFab
  },

  data () {
    const states = {
      INITIAL: {
        show: false
      },
      AUTHENTICATING: {
        show: false
      },
      INCORRECT_CREDENTIALS: {
        show: true,
        text: 'Invalid Username/Password',
        class: 'incorrect-credentials'
      },
      NEED_ORG_NAME: {
        show: true,
        text: 'Organization Name Required',
        class: 'need-org-name'
      },
      GENERIC_ERROR: {
        show: true,
        text: 'An Unknown Error Ocurred. Please Try Again or Contact Support',
        class: 'generic-error'
      },
      NETWORK_ERROR: {
        show: true,
        text: 'Network Error. Please Try Again',
        class: 'network-error'
      }
    }

    return {
      organizationName: '',
      username: '',
      domain: '@renascentinc.com',
      password: '',
      currentState: states.INITIAL,
      passwordResetEmail: '',
      loading: false,
      states
    }
  },

  notifications: {
    showSuccessMsg: {
      type: VueNotifications.types.success,
      title: 'SUCCESS',
      message: 'Instructions for resetting your password have been sent to your email'
    },
    showErrorMsg: {
      type: VueNotifications.types.error,
      title: 'RESET FAILURE',
      message: 'There was an error trying to request a password reset. Please make sure you typed in the correct email. If the issue persists please contact support'
    }
  },

  computed: {
    email () {
      return `${this.username}${this.domain}`
    }
  },

  beforeRouteEnter (to, from, next) {
    window.localStorage.getItem('token') ? next('/') : next()
  },

  methods: {
    requestPasswordReset () {
      this.$validator.validate().then(result => {
        if (result) {
          this.loading = true
          this.$apollo.mutate({
            mutation: gql`mutation attemptRequestPasswordReset($email: String!) {
              requestPasswordReset(email: $email)
            }`,
            variables: {
              email: this.passwordResetEmail
            }
          }).then(response => {
            this.$modal.hide('password-reset-modal')
            this.loading = false
            if (response.data.requestPasswordReset) {
              this.showSuccessMsg()
            } else {
              this.showErrorMsg()
            }
          }).catch(() => {
            this.loading = false
            this.showErrorMsg()
          })
        }
      })
    },

    attemptUserLogin () {
      this.currentState = this.states.AUTHENTICATING

      this.$apollo.mutate({
        mutation: gql`mutation attemptUserLogin($organization_name: String!, $email: String!, $password: String!) {
           login(organization_name: $organization_name, email: $email, password: $password) {
            token,
            user {
              id,
              first_name,
              last_name,
              email,
              phone_number,
              role,
              status
            }
          }
        }`,
        variables: {
          organization_name: this.organizationName,
          email: this.email,
          password: this.password
        }
      }).then(result => {
        let { data: { login: { token, user } } } = result

        user.full_name = `${user.first_name} ${user.last_name}`

        window.localStorage.setItem('token', token)
        window.localStorage.setItem('currentUser', JSON.stringify(user))
        this.$router.push({ path: '/' })
      }).catch(error => {
        if (error.graphQLErrors && error.graphQLErrors.length) {
          let { graphQLErrors: [{ extensions: { code } }] } = error

          if (code === ApiStatusCodes.UNAUTHENTICATED) {
            this.currentState = this.states.INCORRECT_CREDENTIALS
          } else if (code === ApiStatusCodes.INSUFFICIENT_INFORMATION) {
            this.currentState = this.states.NEED_ORG_NAME
          } else {
            this.currentState = this.states.GENERIC_ERROR
          }
        } else if (error.networkError) {
          // remove token just in case a stale one happens to be sitting around.
          // theoretically should never happen but if it ever did the user would
          // be unable to login without clearing their localStorage
          this.currentState = this.states.NETWORK_ERROR
        } else {
          this.currentState = this.states.GENERIC_ERROR
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
$login-input-border-radius: 5px;

.login-page {
  display: flex;
  flex-direction: column;
  background-color: #fff;

  .top-panel {
    display: flex;
    justify-content: center;
    flex: 0 0 60%;

    .name-container {
      display: flex;
      flex-direction: column;
      padding-left: 100px;

      .retina-name {
        color: $renascent-dark-gray;
        font-weight: 700;
        font-size: 50px;
        z-index: 10;
      }

      .renascent-name {
        color: $renascent-dark-gray;
        margin-bottom: 10px;
        font-weight: 500;
        font-size: 18px;
      }
    }
  }

  .bottom-panel {
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
    flex: 0 0 40%;

    .status-message {
      height: 40px;
      display: flex;
      align-items: center;
      color: #CE352F;
      text-align: center;
    }

    .organization-container {
      visibility: hidden;

      &.show {
        visibility: visible;
      }
    }

    .username-input {
      width: calc(100% - 70px);
    }

    .password-input {
      width: calc(100% - 70px);
    }
  }

  .login-inputs-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    flex: 1 1 auto;
    width: 100%;
  }

  .login-action-row {
    display: flex;
    height: 70px;
    align-items: center;
    justify-content: space-around;

    .login-btn {
      width: 130px;
    }
  }

  .password-reset-email-input {
    width: 200px;
    height: 40px;
    font-size: 16px;
  }

  .input-group-container {
    display: flex;
    flex-direction: column;
  }

  .error {
    color: red;
    font-size: 12px;
    height: 16px;
  }

  .request-reset-btn {
    height: 40px;
  }

  .loading {
    height: 80px;
    width: 80px;

    &::after {
      background-color: white;
    }
  }

  .request-action-container {
    display: flex;
    width: 90%;
    justify-content: space-around;
  }

  .reset-password {
    margin-right: 20px;
    font-size: 16px;
    color: $renascent-red;
  }
}

// MOBILE

.mobile {
  .top-panel {
    align-items: flex-end;

    .logo {
      position: absolute;
      left: -210px;
      top: -20px;
      height: 60vh;
      width: 60vh;
    }

    .name-container {
      padding-left: 100px;
    }
  }
}

// DESKTOP

.desktop {
  justify-content: space-between;
  overflow-y: auto;

  .top-panel {
    flex: 1 0 auto;
    align-items: center;
    flex-direction: column;

    .logo {
      position: relative;
      height: 150px;
      width: 150px;
      padding-top: 10px;
    }

    .name-container {
      padding: 0px;
      text-align: center;
      padding-top: 15px;
    }
  }

  .bottom-panel {
    flex: 0 0 auto;

    .login-action-row {
      button, .extended-fab {
        margin-left: 15px;
        margin-right: 15px;
      }
    }

    .input-with-icon {
      flex: 1 0 auto;
    }
  }
}
</style>
