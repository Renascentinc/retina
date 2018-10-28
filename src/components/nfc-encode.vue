<template>
  <button
    :class="{ inactive: isNfcEnabled }"
    class="nfc-encode"
    @click="onClick">
    <div class="fab-icon-container">
      <svgicon
        icon="nfc"
        width="22"
        height="22">
      </svgicon>
    </div>
    <span class="efab-text">{{ readyToEncode ? "CANCEL" : "ENCODE TAG" }}</span>
  </button>
</template>

<script>
import nfc from '../mixins/nfc'
import '../assets/icons/svg/nfc'

export default {
  name: 'NfcEncode',

  mixins: [nfc],

  props: {
    toolId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      readyToEncode: false
    }
  },

  beforeDestroy () {
    if (this.readyToEncode) {
      this.cancelListener()
    }
  },

  methods: {
    encodeTag (tag) {
      window.console.log(tag)

      const record = [
        window.ndef.textRecord(`${this.toolId}`)
      ]

      const failure = (reason) => {
        alert(reason)
      }

      // const lockSuccess = () => {
      //   alert('Success')
      // }

      const lock = () => {
        // window.nfc.makeReadOnly(lockSuccess, failure)
        // alert('Success')
        this.cancelListener()
      }

      window.nfc.write(record, lock, failure)
    },

    onClick () {
      if (!this.readyToEncode) {
        this.startNfcListener(this.encodeTag().bind(this))
        this.readyToEncode = true
      } else {
        this.cancelListener()
      }
    },

    cancelListener () {
      this.closeNfcListener(this.encodeTag().bind(this))
      this.readyToEncode = false
    }
  }
}
</script>

<style lang="scss">
  @import '../styles/variables';

  .nfc-encode {
      padding: 5px 15px;
      border-radius: 50px;
      font-weight: 500;
      height: 50px;
      font-size: 17px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
      font-size: 18px;
      color: $renascent-red;
      border: solid 1px $renascent-red;
      background: transparent;
      width: 190px;

      &.inactive {
        background-color: transparent;
        color: $disabled-gray;
        border: solid 2px $disabled-gray;
        box-shadow: none;
      }

      .fab-icon-container {
        margin-right: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
  }

  .svg-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: middle;
}

.svg-fill {
    fill: transparent;
    stroke: transparent;

    path[pid="1"] {
      stroke: transparent;
      fill: $renascent-red;
    }
}
</style>
