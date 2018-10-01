<template>
  <transition name="fade">
    <div class="page login-page">
      <div class="top-panel">
        <img
          class="logo"
          src="../assets/icons/web/red_transparent_512x512.png"></img>

          <div class="name-container">
            <span class="retina-name"> RETINA </span>
            <span class="renascent-name"> By Renascent, Inc. </span>
          </div>
      </div>
      <div class="bottom-panel">
        <div class="login-input email-container">
          <div class="icon-container">
            <i class="material-icons">person</i>
          </div>
          <input
            :value="username"
            class="username-input"
            placeholder="username">
          <input
            :value="domain"
            class="domain-input"
            placeholder="@domain.com">
        </div>

        <div class="login-input password-container">
          <div class="icon-container">
            <i class="fas fa-key"></i>
          </div>
          <input
            :value="password"
            class="password-input"
            placeholder="password"
            type="password">
        </div>

        <!-- <input
          :value="organizationName"
          class="login-input"
          placeholder="organization name"> -->
        <button
          class="login-btn"
          @click="attemptUserLogin">
          <i class="fas fa-arrow-right"></i>
          <span> SIGN IN </span>
        </button>

          <transition name="fade">
            <div :class="currentState.class">
              <span> {{currentState.text}} </span>
            </div>
          </transition>

        <!-- <transition name="fade">
          <div v-if="currentState === loginStates.INCORRECT_CREDENTIALS">
            Invalid Credentials
          </div>
        </transition>

        <transition name="fade">
          <div v-if="currentState === loginStates.NEED_ORG_NAME">
            Please Also Provide The Name of Your Organization
          </div>
        </transition>

        <transition name="fade">
          <div v-if="currentState === loginStates.AUTHENTICATING">
            Authorizing...
          </div>
        </transition>

        <transition name="fade">
          <div v-if="currentState === loginStates.NETWORK_ERROR">
            Sorry There Was An Issue With The Network
          </div>
        </transition>

        <transition name="fade">
          <div v-if="currentState === loginStates.GENERIC_ERROR">
            Sorry. Something Went Wrong
          </div>
        </transition> -->
      </div>
    </div>
  </transition>
</template>

<script>
import gql from 'graphql-tag'
import ApiStatusCodes from '../utils/api-status-codes'

export default {
  name: 'Login',

  data () {
    const loginStates = {
      READY: {
        text: '',
        class: 'ready'
      },
      AUTHENTICATING: {
        text: 'Authenticating...',
        class: 'authenticating'
      },
      INCORRECT_CREDENTIALS: {
        text: 'Invalid Credentials',
        class: 'incorrect-credentials'
      },
      NEED_ORG_NAME: {
        text: 'Please Also Provide The Name of Your Organization',
        class: 'need-org-name'
      },
      GENERIC_ERROR: {
        text: 'Sorry. Something Went Wrong',
        class: 'generic-error'
      },
      NETWORK_ERROR: {
        text: 'Sorry There Was An Issue With The Network',
        class: 'network-error'
      }
    }

    return {
      organizationName: 'DeWalt',
      username: 'bob.thompson',
      domain: '@renascentinc.com',
      password: 'Test1234!',
      currentState: loginStates.READY,
      loginStates
    }
  },

  methods: {
    attemptUserLogin () {
      this.currentState = this.loginStates.AUTHENTICATING

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

        window.localStorage.setItem('token', token)
        window.localStorage.setItem('currentUser', user)
        this.$router.push({ path: '/' })
      }).catch(error => {
        if (error.graphQLErrors && error.graphQLErrors.length) {
          let { graphQLErrors: [{ extensions: { code } }] } = error

          if (code === ApiStatusCodes.UNAUTHENTICATED) {
            this.currentState = this.loginStates.INCORRECT_CREDENTIALS
          } else if (code === ApiStatusCodes.INSUFFICIENT_INFORMATION) {
            this.currentState = this.loginStates.NEED_ORG_NAME
          } else {
            this.currentState = this.loginStates.GENERIC_ERROR
            window.console.error('Login Attempt Failed With Error Code', code)
          }
        } else if (error.networkError) {
          this.currentState = this.loginStates.NETWORK_ERROR
          window.console.error(error.toString())
        } else {
          this.currentState = this.loginStates.GENERIC_ERROR
          window.console.error(error.toString())
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

  .top-panel {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    flex: 0 0 60%;

    .logo {
      position: absolute;
      left: -210px;
      top: -20px;
      height: 60vh;
      width: 60vh;
    }

    .name-container {
      display: flex;
      flex-direction: column;
      flex: 0 0 55%;

      .retina-name {
        color: $renascent-dark-gray;
        font-weight: 700;
        font-size: 50px;
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
    padding-top: 40px;

    .icon-container {
      width: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $renascent-dark-gray;
      border-top-left-radius: $login-input-border-radius;
      border-bottom-left-radius: $login-input-border-radius;
      color: white;
    }

    .login-input {
      width: 80%;
      border-radius: $login-input-border-radius;
      border: solid 1px black;
      outline: none;
      display: flex;
      height: 40px;
      margin-bottom: 10px;
      max-width: 500px;
    }

    .email-container {
      .username-input {
        border: none;
        outline: none;
        font-size: 15px;
        border-radius: $login-input-border-radius;
        font-family: $font-family;
        margin: 1px 0;

        width: 36%;
        padding-left: 10px;
        text-align: right;
      }

      .domain-input {
        border: none;
        outline: none;
        font-size: 15px;
        border-radius: $login-input-border-radius;
        font-family: $font-family;
        margin: 1px 0;

        width: 45%;
        opacity: .5;
      }
    }

    .password-container {
      margin-bottom: 70px;

      .password-input {
        border: none;
        outline: none;
        font-size: 15px;
        border-radius: $login-input-border-radius;
        font-family: $font-family;

        padding-left: 10px;
      }
    }
  }

  .login-btn {
    width: 130px;
    background-color: $renascent-red;
    height: 40px;
    border-radius: 50px;
    color: white;
    padding: 0;
    font-size: 20px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 10px;
    font-family: $font-family;

    span {
      font-weight: 700;
      font-size: 15px;
    }
  }
}
</style>
