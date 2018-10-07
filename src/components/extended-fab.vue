<template>
  <button class="extended-fab" @click="onClick">
    <div class="fab-icon-container">
      <i class="fas" :class="iconClass"></i>
    </div>
    <span class="efab-text">{{buttonText}}</span>
  </button>
</template>

<script>
export default {
  name: 'input-with-icon',

  props: [
    'iconClass',
    'buttonText',
    'onClick'
  ]
}
</script>

<style lang="scss">
  @import '../styles/variables';

  .extended-fab {
      background-color: #CE352F;
      padding: 5px 15px;
      border-radius: 50px;
      color: white;
      font-weight: 500;
      height: 40px;
      font-size: 17px;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .fab-icon-container {
        margin-right: 5px;
        font-size: 20px;
      }
  }
</style>
