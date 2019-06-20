<template>
  <div
    :class="$mq"
    class="page login-page"
  >
    <loading-overlay :active="currentState === states.AUTHENTICATING"/>

    <div class="top-panel">
      <img class="logo" src="@/assets/icons/red_transparent_512x512.svg">

      <div class="name-container">
        <span class="retina-name"> RETINA </span>
        <span class="renascent-name"> Renascent, Inc. </span>
      </div>
    </div>
    <form class="bottom-panel" v-on:submit.prevent="attemptUserLogin">
      <div class="status-message">
        <transition name="fade">
          <span
            v-if="currentState.show"
            :class="currentState.class"
          >
            {{ currentState.text }}
          </span>
        </transition>
      </div>

      <div class="login-inputs-container">
        <input-with-icon
          class="email-container"
          icon-class="fa-user"
        >
          <input
            v-model="username"
            class="username-input"
            placeholder="username"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            autocomplete
          >
        </input-with-icon>

        <input-with-icon
          class="password-container"
          icon-class="fa-key"
        >
          <input
            v-model="password"
            class="password-input"
            placeholder="password"
            type="password"
            autocomplete
          >
        </input-with-icon>

        <input-with-icon
          :class="{ show: currentState === states.NEED_ORG_NAME }"
          class="organization-container"
          icon-class="fa-building"
        >
          <input
            v-model="organizationName"
            class="org-name-input"
            placeholder="organization name"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            autocomplete
          >
        </input-with-icon>
      </div>

      <div class="login-action-row">
        <button
          class="reset-password"
          type="button"
          @click="requestPasswordReset"
        >
          FORGOT PASSWORD?
        </button>

        <extended-fab
          class="login-btn"
          icon-class="fa-arrow-right"
          button-text="SIGN IN"
          type="submit"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { requestPasswordResetMutation, loginMutation } from '@/utils/gql'
import { showSuccessMsg, showErrorMsg } from '@/utils/alerts'
import ApiStatusCodes from '@/utils/api-status-codes'
import InputWithIcon from '@/components/input-with-icon'
import ExtendedFab from '@/components/basic/extended-fab'
import LoadingOverlay from '@/components/basic/loading-overlay'
import swal from 'sweetalert2'

export default {
  name: 'Login',

  components: {
    InputWithIcon,
    ExtendedFab,
    LoadingOverlay
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
      defaultDomain: '@renascentinc.com',
      password: '',
      currentState: states.INITIAL,
      states
    }
  },

  computed: {
    email () {
      if (this.username.indexOf('@') > -1) {
        return this.username
      }
      return `${this.username}${this.defaultDomain}`
    }
  },

  methods: {
    async requestPasswordReset () {
      let result = await swal({
        title: 'RESET PASSWORD',
        text: 'Enter your email address',
        input: 'email',
        inputPlaceholder: 'email@example.com',
        reverseButtons: true,
        showCancelButton: true,
        cancelButtonText: 'CANCEL',
        confirmButtonText: 'SUBMIT',
        confirmButtonColor: '#404040'
      })

      if (result && result.value) {
        try {
          let { data: { requestPasswordReset } } = await this.$apollo.mutate({
            mutation: requestPasswordResetMutation,
            variables: {
              email: result.value
            }
          })

          if (requestPasswordReset) {
            showSuccessMsg('Instructions for resetting your password will be sent to your email')
          }
        } catch {
          showErrorMsg('There was an error trying to request a password reset. Please make sure you typed in the correct email. If the issue persists please contact support', 'RESET FAILURE')
        }
      }
    },

    async attemptUserLogin () {
      this.currentState = this.states.AUTHENTICATING

      try {
        let { data: { login: { token, user } } } = await this.$apollo.mutate({
          mutation: loginMutation,
          variables: {
            organization_name: this.organizationName,
            email: this.email,
            password: this.password
          }
        })

        user.full_name = `${user.first_name} ${user.last_name}`

        window.localStorage.setItem('token', token)
        window.localStorage.setItem('currentUser', JSON.stringify(user))
        this.$router.push({ path: '/' })
      } catch (error) {
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
      }
    }
  },

  beforeRouteEnter (to, from, next) {
    window.localStorage.getItem('token') ? next('/') : next()
  }
}
</script>

<style lang="scss">

$login-input-border-radius: 5px;

.login-page {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  max-height: 1200px;

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
    height: 15vh;
    align-items: center;
    justify-content: space-around;

    .login-btn {
      height: 45px;
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

  .request-action-container {
    display: flex;
    width: 90%;
    justify-content: space-around;
  }

  .reset-password {
    padding: 0;
    margin-right: 20px;
    font-size: 16px;
    color: $renascent-red;
  }
}

.mobile.login-page {
  .bottom-panel {
    padding-bottom: 350px;
  }
}

.desktop.login-page,
.mobile.login-page {
  justify-content: space-between;
  overflow-y: auto;

  .top-panel {
    align-items: center;
    flex-direction: column;

    .logo {
      position: relative;
      height: 200px;
      width: 200px;
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
