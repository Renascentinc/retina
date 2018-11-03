<template>
  <button
    :class="{ inactive: disabled }"
    :disabled="disabled"
    class="fab"
    @click="onClick">
    <div class="fab-icon-container">
      <i
        :class="iconClass"
        class="fas">
      </i>
    </div>
  </button>
</template>

<script>
export default {
  name: 'Fab',

  props: {
    iconClass: {
      type: String,
      required: true
    },

    onClick: {
      type: Function,
      required: true
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

  .fab {
      background-color: $renascent-red;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      cursor: pointer;
      border: none;
      border-radius: 50%;
      color: white;
      font-weight: 500;
      height: 57px;
      width: 57px;
      font-size: 24px;
      display: flex;
      justify-content: space-around;
      align-items: center;

      &.inactive {
        background-color: $disabled-gray;
        box-shadow: none;
      }
  }
</style>
