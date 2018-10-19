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
          v-if="!activated"
          :class="iconClass || 'fa-pen'"
          class="fas"/>
      </div>
      <span class="text">{{ buttonText }}</span>
    </button>
    <div class="options"
      v-if="activated">

      <button
        class="option button"
        v-for="option in filteredOptions()"
        @click="clickOption(option)"
        :key="option">
        {{ option }}
      </button>

    </div>
  </div>
</template>

<script>
export default {
  name: 'ButtonDropdown',

  data () {
    return {
      activated: false,
    }
  },

  methods: {
    clickOption (selectedOption) {
      this.$props.onClick(selectedOption)
      this.activated = false;
    },

    showOptions () {
      this.activated = !this.activated;
    },

    filteredOptions () {
      var array = this.$props.options;
      var index = array.indexOf(this.$props.buttonText);
      if (index !== -1) {
        array.splice(index, 1);
      }

      return array
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
    options: {
      type: Array,
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
.options {
  position: absolute;

  .button {
    margin-top: 11px;
    display: flex;
    justify-content: center;
  }
}

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
