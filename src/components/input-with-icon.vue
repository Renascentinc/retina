<template>
  <div class="input-with-icon">
    <div class="icon-container">
      <i
        :class="iconClass"
        class="fas"
      >
      </i>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'InputWithIcon',

  props: {
    iconClass: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss">
  @import '../styles/variables';

  $login-input-border-radius: 5px;

  .input-with-icon {
    width: 80%;
    border-radius: $login-input-border-radius;
    border: solid 1px $renascent-dark-gray;
    outline: none;
    display: flex;
    height: 40px;
    min-height: 40px;
    max-height: 40px;
    margin-bottom: 5px;
    max-width: 400px;

    input {
      -webkit-appearance: none;
      border: none;
      outline: none;
      font-size: 15px;
      border-radius: $login-input-border-radius;
      font-family: $font-family;
      margin: 1px 0;
      padding-left: 10px;
    }

    .icon-container {
      width: 40px;
      min-width: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $renascent-dark-gray;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      color: white;
    }
  }
</style>
