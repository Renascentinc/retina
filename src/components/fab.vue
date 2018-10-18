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
      border: none;
      background-color: #CE352F;
      border-radius: 50%;
      color: white;
      height: 55px;
      width: 55px;
      font-size: 24px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      padding: 0;
  }
</style>
