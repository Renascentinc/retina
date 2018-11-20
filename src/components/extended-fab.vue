<template>
  <button
    :class="{ outlined: outlineDisplay, inactive: disabled }"
    :disabled="disabled"
    class="extended-fab"
    @click="onClick">
    <div
      v-if="!loading"
      class="fab-icon-container">
      <i
        :class="iconClass"
        class="fas">
      </i>
    </div>
    <span
      v-if="!loading"
      class="efab-text">
      {{ buttonText }}
    </span>
    <div
      v-if="loading"
      class="loading">
    </div>
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
    },

    loading: {
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
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border: none;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
      font-size: 18px;
      cursor: pointer;
      flex: 0 0 auto;

      .loading {
        top: -45px;
        background: linear-gradient(to right, #fff 10%, rgba(64, 64, 64, 0) 42%);

        &::before {
          background: #fff;
        }

        &::after {
          background-color: $renascent-red;
        }
      }

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
