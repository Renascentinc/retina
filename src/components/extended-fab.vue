<template>
  <button
    :class="{ outlined: outlineDisplay }"
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
    },
    outlineDisplay: {
      type: Boolean,
      required: false,
      default: false
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
      font-weight: 700;
      height: 50px;
      font-size: 17px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      border: none;
      box-shadow: 0 0 10px #777;
      font-size: 18px;

      &.outlined {
        color: $renascent-red;
        border: solid 2px $renascent-red;
        background: transparent;
      }

      .fab-icon-container {
        margin-right: 5px;
        font-size: 25px;
      }
  }
</style>
