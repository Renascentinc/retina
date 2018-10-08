<template>
  <button
    class="extended-fab"
    @click="onClick">
    <div class="fab-icon-container">
      <i
        :class="iconClass"
        class="fas"/>
    </div>
    <span class="efab-text">{{ buttonText }}</span>
  </button>
</template>

<script>
export default {
  name: 'ExtendedFab',

  props: {
    iconClass: {
      type: String,
      required: true
    },
    buttonText: {
      type: String,
      required: true
    },
    onClick: {
      type: Function,
      required: true
    }
  }
}
</script>

<style lang="scss">
  @import '../styles/variables';

  .extended-fab {
      background-color: $renascent-red;
      padding: 5px 15px;
      border-radius: 50px;
      color: white;
      font-weight: 500;
      height: 40px;
      font-size: 17px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      border: none;

      .fab-icon-container {
        margin-right: 5px;
        font-size: 20px;
      }
  }
</style>
