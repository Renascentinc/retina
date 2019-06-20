<template>
  <div class="page landing-page">
    <img class="logo" src="@/assets/icons/red_transparent_512x512.svg">
    <span class="retina-name"> RETINA </span>
  </div>
</template>

<script>
export default {
  name: 'Login'
}
</script>

<style lang="scss">

.landing-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;

  .logo {
    height: 30vh;
    width: 30vh;
  }

  .retina-name {
    color: $renascent-dark-gray;
    font-weight: 700;
    font-size: 50px;
    margin-top: 30px;
  }
}
</style>
