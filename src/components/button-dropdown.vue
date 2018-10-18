<template>
  <div class="container">
    <div
      class="scrim"
      v-if="activated"/>
    <button
      class="button"
      @click="showOptions">
      <div class="fab-icon-container">
        <i
          :class="iconClass || 'fa-pen'"
          class="fas"/>
      </div>
      <span class="text">{{ buttonText }}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ButtonDropdown',

  data () {
    return {
      activated: false
    }
  },

  methods: {
    showOptions () {
      this.activated = !this.activated;
    }
  },

  props: {
    iconClass: {
      type: String,
      required: false
    },
    buttonText: {
      type: String,
      required: true
    },
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
.scrim {
  background-color: rgba(255, 255, 255, 0.70);
  width: 100vw;
  height: 100vh;
  position: absolute;
  display: block;
  top: 0px;
  left: 0px;
  z-index: -5;
}

.button{
  background-color: $renascent-red;
  height: 43px;
  width: 154px;
  border: none !important;
  border-radius: 5px;
  color: white;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  padding: 0px;
  padding-left: 12px;
  font-size: 13px;
  display: flex;
  align-content: center;

  .text {
    flex: 1 0 auto;
    margin-top: auto;
    margin-bottom: auto;
  }

  .fas {
    font-size: 18px;
  }
}
</style>
