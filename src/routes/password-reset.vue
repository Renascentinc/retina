<template>
  <div class="page password-reset-page">
    <img class="logo" src="@/assets/icons/red_transparent_512x512.svg">

    <span class="header-text">
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
        <span class="is-danger error-msg">
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
import { resetCodeValidityQuery, passwordResetMutation } from '@/utils/gql'
import { showSuccessMsg, showErrorMsg } from '@/utils/alerts'
import ExtendedFab from '@/components/basic/extended-fab.vue'
import ApiStatusCodes from '@/utils/api-status-codes'

export default {
  name: 'PasswordReset',

  components: {
    ExtendedFab
  },

  apollo: {
    isPasswordResetCodeValid: {
      query: resetCodeValidityQuery,
      variables () {
        return {
          password_reset_code: this.$route.query.code
        }
      },
      result (response) {
        if (!response.data.isPasswordResetCodeValid) {
          this.onInvalidTokenError()
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
    onInvalidTokenError () {
      showErrorMsg('Your Reset Token Has Expired. Please Try Resetting Your Password Again', 'INVALID TOKEN')
      this.$router.push({ path: '/login' })
    },

    async attemptPasswordReset () {
      let result = await this.$validator.validate()

      if (result) {
        try {
          let { data: { resetPassword } } = await this.$apollo.mutate({
            mutation: passwordResetMutation,
            variables: {
              new_password: this.password,
              password_reset_code: this.$route.query.code
            }
          })

          if (resetPassword) {
            showSuccessMsg('Successfully Reset Password')
            this.$router.push({ path: '/login' })
          }
        } catch (error) {
          if (error && error.graphQLErrors.length && error.graphQLErrors[0].extensions.code === ApiStatusCodes.UNAUTHENTICATED) {
            this.onInvalidTokenError()
          } else {
            showErrorMsg('There was an error trying to reset your password. Please try again or contact support', 'RESET FAILURE')
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">

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
