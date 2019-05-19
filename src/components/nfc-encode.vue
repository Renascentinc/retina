<template>
  <button
    :class="{ inactive: !isNfcWriteEnabled }"
    class="nfc-encode"
    @click="onClick"
  >
    <div class="fab-icon-container">
      <svgicon
        icon="nfc"
        width="22"
        height="22"
      >
      </svgicon>
    </div>
    <span class="efab-text">
      ENCODE TAG
    </span>
  </button>
</template>

<script>
import swal from 'sweetalert2'
import nfcMixin from '../mixins/nfc'
import '../assets/icons/svg/nfc'

export default {
  name: 'NfcEncode',

  mixins: [nfcMixin],

  props: {
    toolId: {
      type: String,
      required: false,
      default: ''
    }
  },

  methods: {
    showSuccessMsg () {
      swal({
        type: 'success',
        title: 'SUCCESS',
        text: 'Successfully encoded tag',
        timer: 1500,
        showConfirmButton: false
      })
    },

    showInfoMsg () {
      swal({
        type: 'info',
        title: 'LOCKED TAG',
        text: 'This Tag Has Already Been Encoded and Cannot Be Written Again',
        timer: 2000,
        showConfirmButton: false
      })
    },

    showErrorMsg () {
      swal({
        type: 'error',
        title: 'ERROR',
        text: 'An Error Occurred Trying to Write Tag. Please Try Again or Contact Support',
        timer: 2000,
        showConfirmButton: false
      })
    },

    showNfcDisabledMsg () {
      swal({
        type: 'info',
        title: 'NFC NOT AVAILABLE',
        text: 'If You Want To Write NFC Tags Please Use The Mobile App on an Android Phone',
        timer: 2500,
        showConfirmButton: false
      })
    },

    onError (reason) {
      if (reason === 'Tag is read only') {
        this.showInfoMsg()
      } else {
        this.showErrorMsg()
      }

      this.pauseNfcListener()
    },

    _nfcCallback (tag) {
      if (!this.toolId) {
        return
      }

      const record = [
        window.ndef.textRecord(`${this.toolId} - Property of Renascent, Inc. (http://renascentinc.com)`)
      ]

      const lock = () => {
        window.nfc.makeReadOnly(() => this.showSuccessMsg(), (reason) => this.onError(reason))
        this.pauseNfcListener()
      }

      window.nfc.write(record, lock, (reason) => this.onError(reason))
    },

    onClick () {
      if (this.isNfcWriteEnabled) {
        this.startNfcListener()
        this.showReadyToScanModal()
      } else {
        this.showNfcDisabledMsg()
      }
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
