<template>
<div class="page login-page">
  <div class="logo-container">
    <img class="logo" src="../assets/icons/web/white_transparent_512x512.png"></img>
  </div>
  <div class="login-input-container">
    <input class="login-input" placeholder="username"/>
    <input class="login-input" placeholder="password"/>
    <button class="login-btn">LOGIN</button>
  </div>
</div>
</template>

<script>
export default {
  name: 'login',

  apollo: {
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
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.login-page {
  display: flex;
  flex-direction: column;
  background-color: $renascent-dark-gray;
  overflow: hidden;
  height: 100%;

  .logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 30%;

    .logo {
      height: 20vh;
      width: 20vh;
    }
  }

  .login-input-container {
    display: flex;
    // justify-content: center;
    align-items: center;
    flex-direction: column;
    flex: 1 1 auto;
    overflow: hidden;

    .login-input {
      width: 80%;
      height: 30px;
      border-radius: 20px;
      border: none;
      padding-left: 10px;
      margin-bottom: 30px;
    }
  }
}
</style>
