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
    <span class="efab-text">ENCODE TAG</span>
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
      required: true
    }
  },

  methods: {
    showSuccessMsg () {
      swal({
        type: 'success',
        title: 'SUCCESS',
        text: 'Successfully encoded tag'
      })
    },

    showInfoMsg () {
      swal({
        type: 'info',
        title: 'LOCKED TAG',
        text: 'This Tag Has Already Been Encoded and Cannot Be Written Again'
      })
    },

    showErrorMsg () {
      swal({
        type: 'error',
        title: 'ERROR',
        text: 'An Error Occurred Trying to Write Tag. Please Try Again or Contact Support'
      })
    },

    onError (reason) {
      if (reason === 'Tag is read only') {
        this.showInfoMsg()
      } else {
        this.showErrorMsg()
      }

      this.pauseNfcListener()
      this.$modal.hide('ready-to-scan-modal')
    },

    _nfcCallback (tag) {
      const record = [
        window.ndef.textRecord(`${this.toolId} - Property of Renascent, Inc. (http://renascentinc.com)`)
      ]

      const lock = () => {
        window.nfc.makeReadOnly(() => this.showSuccessMsg(), (reason) => this.onError(reason))
        this.pauseNfcListener()
        this.$modal.hide('ready-to-scan-modal')
      }

      window.nfc.write(record, lock, (reason) => this.onError(reason))
    },

    onClick () {
      this.startNfcListener()
      this.$modal.show('ready-to-scan-modal')
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
