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
        <input-with-icon class="email-container" icon-class="fa-user">
          <input
            v-model="username"
            class="username-input"
            placeholder="username">
          <input
            v-model="domain"
            class="domain-input"
            placeholder="@domain.com">
        </input-with-icon>

        <input-with-icon class="password-container" icon-class="fa-key">
        <input
          v-model="password"
          class="password-input"
          placeholder="password"
          type="password">
        </input-with-icon>

        <input-with-icon class="organization-container" icon-class="fa-building">
        <input
          v-model="organizationName"
          class="org-name-input"
          placeholder="organization name">
        </input-with-icon>

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
      </div>
    </div>
  </transition>
</template>

<script>
import gql from 'graphql-tag'
import ApiStatusCodes from '../utils/api-status-codes'
import InputWithIcon from '../components/input-with-icon'

export default {
  name: 'Login',

  components: {
    InputWithIcon
  },

  computed: {
    email() {
      return `${this.username}${this.domain}`
    }
  },

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
      organizationName: '',
      username: '',
      domain: '@renascentinc.com',
      password: '',
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

    .username-input {
      width: 40%;
    }

    .domain-input {
      width: 140px;
      opacity: .5;
      padding: 0;
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
