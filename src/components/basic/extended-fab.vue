<template>
  <v-btn
    :class="{ outlined: outlineDisplay, inactive: disabled }"
    :disabled="disabled"
    :type="buttonType"
    class="extended-fab"
    @click="onClick"
  >
    <div
      class="fab-icon-container"
    >
      <i
        :class="iconClass"
        class="fas"
      >
      </i>
    </div>
    <span
      class="efab-text"
    >
      {{ buttonText }}
    </span>
  </v-btn>
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

    buttonType: {
      type: String,
      required: false,
      default: 'button'
    },

    onClick: {
      type: Function,
      required: false,
      default: () => {}
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

  .extended-fab {
      background-color: $renascent-red;
      padding: 5px 15px;
      border-radius: 50px;
      color: white;
      font-weight: 500;
      height: 50px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border: none;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
      font-size: 18px;
      cursor: pointer;
      flex: 0 0 auto;

      .efab-text {
        margin-left: auto;
        margin-right: auto;
      }

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

  // DESKTOP

  .desktop {
    .extended-fab {
      border-radius: 5px;
      font-size: 14px;
      padding: 0px 5px;
      height: 40px;
      width: 158px;

      .fab-icon-container {
        font-size: 20px;
        margin-right: 0px;
        float: left;
        margin-left: 5px;
      }
    }
  }
</style>
