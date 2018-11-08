<template>
  <div
    class="container"
    :class="{ disabled: disabled }">

    <transition name="fade">
      <div
        v-if="activated"
        class="scrim"
        @click="toggle">
      </div>
    </transition>

    <button
      class="button"
      @click="toggle">
      <div class="fab-icon-container">
        <i
          v-if="!activated"
          :class="iconClass"
          class="fas">
        </i>
      </div>
      <span
        v-if="!activated"
        class="text">
        {{ buttonText }}
      </span>
      <i
        v-if="activated"
        class="close fas fa-times">
      </i>

    </button>

    <transition name="fade">
      <div
        v-if="activated"
        class="options">

        <button
          v-for="option in options"
          :key="option"
          class="option button slide-item"
          @click="clickOption(option)">
          {{ option }}
        </button>

      </div>
    </transition>

  </div>
</template>

<script>
export default {
  name: 'ButtonDropdown',

  props: {
    iconClass: {
      type: String,
      required: false,
      default: 'fa-pen'
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
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    flag: {
      type: Function,
      required: false,
      default: () => {}
    }
  },

  data () {
    return {
      activated: false
    }
  },

  methods: {
    clickOption (selectedOption) {
      this.onClick(selectedOption)
      this.flag()
      this.activated = false
    },

    toggle () {
      if (!this.disabled) {
        this.activated = !this.activated
      }
      this.flag()
    },

    filteredOptions () {
      var array = this.options
      var index = array.indexOf(this.buttonText)
      if (index !== -1) {
        array.splice(index, 1)
      }

      return array
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.options {
  position: absolute;

  .button {
    margin-top: 11px;
    display: flex;
    justify-content: center;
  }
}

.scrim {
  background-color: rgba(255, 255, 255, 0.75);
  width: 100vw;
  height: 100vh;
  position: absolute;
  display: block;
  top: 0px;
  left: 0px;
  z-index: -5;
}

.disabled {
  .button {
    background-color: $disabled-gray;
    box-shadow: none;
    cursor: default;
  }
}

.button {
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
  cursor: pointer;

  .text {
    flex: 1 0 auto;
    margin-top: auto;
    margin-bottom: auto;
  }

  .close {
    flex: 1 0 auto;
    margin-top: auto;
    margin-bottom: auto;
  }

  .fas {
    font-size: 18px;
  }
}

// DESKTOP

.desktop {
  .button {
    width: 158px;
    height: 40px;
  }
}
</style>
