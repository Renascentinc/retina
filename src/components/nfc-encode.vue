<template>
  <button
    :class="{ inactive: !isNfcWriteEnabled }"
    class="nfc-encode"
    @click="onClick"
  >
    <div class="fab-icon-container">
      <img class="nfc-icon" src="@/assets/icons/nfc.svg"/>
    </div>
    <span class="efab-text">
      ENCODE TAG
    </span>
  </button>
</template>

<script>
import Vue from 'vue'
import { mapActions } from 'vuex'
import swal from 'sweetalert2'
import nfcMixin from '@/mixins/nfc'
import Platforms from '@/utils/platforms'

export default {
  name: 'NfcEncode',

  mixins: [nfcMixin],

  props: {
    tool: {
      type: Object,
      required: false,
      default () {
        return {}
      }
    }
  },

  methods: {
    ...mapActions('tools', [
      'updateTool'
    ]),

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
        Vue.rollbar.error('Error in components:nfc-encode', reason)
      }

      this.pauseNfcListener()
    },

    onSuccess () {
      window.nfc.makeReadOnly(() => this.showSuccessMsg(), (reason) => this.onError(reason))
      this.pauseNfcListener()
      if (!this.tool.tagged) {
        this.tool.tagged = true
        this.updateTool(this.tool)
      }
    },

    _nfcCallback (tag) {
      if (!this.tool.id) {
        return
      }

      const record = [
        window.ndef.textRecord(`${this.tool.id} - Property of Renascent, Inc. (http://renascentinc.com)`)
      ]
      window.nfc.write(record, () => this.onSuccess(), (reason) => this.onError(reason))
    },

    onClick () {
      if (this.isNfcWriteEnabled) {
        if (window.device.platform === Platforms.ANDROID) {
          this.showReadyToScanModal()
          this.startNfcListener()
        } else if (window.device.platform === Platforms.IOS) {
          this._nfcCallback()
        }
      } else {
        this.showNfcDisabledMsg()
      }
    }
  }
}
</script>

<style lang="scss">

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

      .nfc-icon {
        height: 22px;
        width: 22px;
      }

      &.inactive {
        opacity: .5;
        color: $disabled-gray;
        border: solid 1px $disabled-gray;
        box-shadow: none;

        .nfc-icon {
          opacity: .5;
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
