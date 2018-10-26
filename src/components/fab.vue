<template>
  <button
    :class="[this.$props.active() ? 'active' : 'inactive']"
    class="fab"
    @click="onClick">
    <div class="fab-icon-container">
      <i
        :class="iconClass"
        class="fas"/>
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
    active: {
      type: Function,
      required: false,
      default: () => { return true }
    }
  }
}
</script>

<style lang="scss">
  @import '../styles/variables';
  .inactive {
    background-color: $disabled-gray;
    box-shadow: none;
  }

  .active {
    background-color: $renascent-red;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.25)
  }

  .fab {
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
  }
</style>
