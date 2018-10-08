<template>
  <button
    class="fab"
    @click="onClick">
    <i
      :class="iconClass"
      class="fas"/>
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
    }
  }
}
</script>

<style lang="scss">
  @import '../styles/variables';

  .fab {
    background-color: $renascent-red;
    padding: 0;
    border-radius: 50%;
    color: white;
    height: 40px;
    width: 40px;
    font-size: 19px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
  }
</style>
