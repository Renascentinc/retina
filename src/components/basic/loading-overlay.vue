<template>
  <transition name="fade">
    <div
      v-if="active"
      class="loading-overlay"
    >
      <loading-spinner/>
    </div>
  </transition>
</template>

<script>
import LoadingSpinner from '@/components/basic/loading-spinner'

export default {
  name: 'LoadingOverlay',

  components: {
    LoadingSpinner
  },

  props: {
    active: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style lang="scss">

.loading-overlay {
  background-color: black;
  position: absolute;
  height: 100vh;
  width: 100vw;
  opacity: .5;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;

  .half-circle-spinner {
    height: 35vw;
    max-height: 120px;
    width: 35vw;
    max-width: 120px;

    .circle {
      border-width: 7px;
    }
  }
}
</style>
