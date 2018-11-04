<template>
  <button
    :class="{ outlined: outlineDisplay, inactive: disabled }"
    :disabled="disabled"
    class="extended-fab"
    @click="onClick">
    <div class="fab-icon-container">
      <i
        :class="iconClass"
        class="fas">
      </i>
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
    },

    disabled: {
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
      font-weight: 500;
      height: 50px;
      font-size: 17px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      border: none;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
      font-size: 18px;

      &.outlined {
        color: $renascent-red;
        border: solid 2px $renascent-red;
        background: transparent;

        &.inactive {
          background-color: transparent;
          color: $disabled-gray;
          border: solid 2px $disabled-gray;
          box-shadow: none;
        }
      }

      &.inactive {
        background-color: $disabled-gray;
        box-shadow: none;
      }

      .fab-icon-container {
        margin-right: 5px;
        font-size: 25px;
      }
  }
</style>
