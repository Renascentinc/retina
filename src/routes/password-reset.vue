<template>
  <div class="page password-reset-page">
    <img
      class="logo"
      src="../assets/icons/web/red_transparent_512x512.png"
    >

    <span
      class="header-text"
    >
      RESET YOUR PASSWORD
    </span>

    <div class="input-card">
      <div class="input-group-container">
        <input
          v-validate="'required'"
          ref="password"
          v-model="password"
          :class="{'is-danger': errors.has('password')}"
          class="light-input"
          name="password"
          type="password"
          placeholder="Password"
        >
        <span
          class="is-danger error-msg"
        >
          {{ errors.first('password') }}
        </span>
      </div>

      <input
        v-validate="'required|confirmed:password'"
        v-model="confirmPassword"
        :class="{'is-danger': errors.has('password_confirmation')}"
        class="light-input"
        name="password_confirmation"
        type="password"
        placeholder="Confirm Password"
        data-vv-as="password"
      >

      <extended-fab
        :on-click="attemptPasswordReset"
        :disabled="!password || !confirmPassword"
        icon-class=""
        button-text="RESET"
      />
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import swal from 'sweetalert2'
import ExtendedFab from '../components/extended-fab.vue'
import ApiStatusCodes from '../utils/api-status-codes'

export default {
  name: 'PasswordReset',

  components: {
    ExtendedFab
  },

  apollo: {
    isPasswordResetCodeValid: {
      query: gql`query checkResetCode($password_reset_code: ID!) {
        isPasswordResetCodeValid(password_reset_code: $password_reset_code)
      }`,
      variables () {
        return {
          password_reset_code: this.$route.query.code
        }
      },
      result (response) {
        if (!response.data.isPasswordResetCodeValid) {
          this.showInvalidTokenError()
          this.$router.push({ path: '/login' })
        }
      }
    }
  },

  data () {
    return {
      password: '',
      confirmPassword: ''
    }
  },

  methods: {
    showSuccessMsg () {
      swal({
        type: 'success',
        title: 'SUCCESS',
        text: 'Successfully Reset Password',
        timer: 2000,
        showConfirmButton: false
      })
    },

    showErrorMsg () {
      swal({
        type: 'error',
        title: 'RESET FAILURE',
        text: 'There was an error trying to reset your password. Please try again or contact support',
        timer: 2000,
        showConfirmButton: false
      })
    },

    showInvalidTokenError () {
      swal({
        type: 'error',
        title: 'INVALID TOKEN',
        text: 'Your Reset Token Has Expired. Please Try Resetting Your Password Again',
        timer: 2000,
        showConfirmButton: false
      })
    },

    attemptPasswordReset () {
      this.$validator.validate().then(result => {
        if (result) {
          this.$apollo.mutate({
            mutation: gql`mutation attemptPasswordReset($new_password: String!, $password_reset_code: ID!) {
              resetPassword(new_password: $new_password, password_reset_code: $password_reset_code)
            }`,
            variables: {
              new_password: this.password,
              password_reset_code: this.$route.query.code
            }
          }).then(response => {
            if (response.data.resetPassword) {
              this.showSuccessMsg()
              this.$router.push({ path: '/login' })
            } else {
              this.showErrorMsg()
            }
          }).catch(response => {
            if (response && response.graphQLErrors.length && response.graphQLErrors[0].extensions.code === ApiStatusCodes.UNAUTHENTICATED) {
              this.showInvalidTokenError()
            } else {
              this.showErrorMsg()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.password-reset-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .input-card {
    display: flex;
    flex-direction: column;
    margin: 10px 10px 0 10px;
    background-color: white;
    align-items: center;
    justify-content: space-around;
    padding: 0 20px;
    border-radius: 3px;
    height: 250px;
    width: 300px;
  }

  .input-group-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .logo {
    height: 30vh;
    width: 30vh;
  }

  .light-input {
    font-size: 15px;

    &::placeholder {
      color: $form-placeholder-color;
    }
  }

  .is-danger {
    color: red;
  }

  .error-msg {
    height: 16px;
  }

  .header-text {
    color: $renascent-dark-gray;
    font-weight: 700;
    font-size: 30px;
    margin-top: 30px;
  }
}
</style>
