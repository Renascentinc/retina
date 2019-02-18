<template>
  <div
    class="container search-result"
    @click="onClick"
  >
    <div class="default-text">
      <i class="fas fa-plus"></i>
      NEW {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddResult',

  props: {
    text: {
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
@import '../styles/add-button';
</style>
