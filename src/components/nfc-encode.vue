<template>
  <button
    :class="{ inactive: !isNfcWriteEnabled }"
    :disabled="!isNfcWriteEnabled"
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

  methods: {
    _nfcCallback (tag) {
      window.console.log(tag)

      const record = [
        window.ndef.textRecord(`${this.toolId} - Property of Renascent inc. (http://renascentinc.com)`)
      ]

      const failure = (reason) => {
        window.console.error('NFC: failure to write tag')
      }

      // const lockSuccess = () => {
      //   alert('Success')
      // }

      const lock = () => {
        // window.nfc.makeReadOnly(lockSuccess, failure)
        window.console.log('NFC: successfully encoded tag')
        this.cancelListener()
      }

      window.nfc.write(record, lock, failure)
    },

    onClick () {
      if (!this.readyToEncode) {
        this.startNfcListener()
        this.readyToEncode = true
      } else {
        this.cancelListener()
      }
    },

    cancelListener () {
      this.pauseNfcListener()
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
        opacity: .5;
        color: $disabled-gray;
        border: solid 1px $disabled-gray;
        box-shadow: none;

        path[pid="1"] {
          stroke: transparent;
          fill: $disabled-gray !important;
        }
      }

      .fab-icon-container {
        margin-right: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
  }
</style>
