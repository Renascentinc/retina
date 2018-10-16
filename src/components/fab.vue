<template>
  <button
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
  name: 'InputWithIcon',

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
      font-weight: 500;
      height: 57px;
      width: 57px;
      font-size: 24px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16)
  }
</style>
