<template>
  <div class="nfc-scan-container">
    <button
      :class="{ inactive: !checkIsNfcEnabled() }"
      class="nfc-scan"
      @click="onClick">
      <svgicon
        icon="nfc"
        width="22"
        height="22">
      </svgicon>
      <span>SCAN</span>
    </button>
  </div>
</template>

<script>
import swal from 'sweetalert2'
import ExtendedFab from '../components/extended-fab'
import Platforms from '../utils/platforms'
import nfcMixin from '../mixins/nfc'
import '../assets/icons/svg/nfc'

export default {
  name: 'NfcScan',

  components: {
    ExtendedFab
  },

  mixins: [nfcMixin],

  props: {
    onScan: {
      type: Function,
      required: true
    }
  },

  methods: {
    showBlankTagMsg () {
      swal({
        type: 'info',
        title: 'BLANK TAG',
        text: 'This Tag is Blank',
        timer: 2000,
        showConfirmButton: false
      })
    },

    showNfcDisabledMsg () {
      swal({
        type: 'info',
        title: 'NFC NOT AVAILABLE',
        text: 'If You Want To Scan NFC Tags Please Use The Mobile App on an iOS or Android Device',
        timer: 2000,
        showConfirmButton: false
      })
    },

    nfcCallback (value) {
      if (value) {
        if (window.device.platform === Platforms.ANDROID) {
          swal.close()
        }

        this.onScan(value)
      } else {
        this.showBlankTagMsg()
      }
    },

    onClick () {
      if (this.checkIsNfcEnabled()) {
        this.startNfcListener()

        if (window.device.platform === Platforms.ANDROID) {
          this.showReadyToScanModal()
        }
      } else {
        this.showNfcDisabledMsg()
      }
    }
  }
}
</script>

<style lang="scss">
  @import '../styles/variables';

  .nfc-scan-container {
    display: flex;

    .nfc-scan {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 50px;
      padding: 0;

      span {
        font-size: 10px;
        font-weight: 900;
        margin-top: 2px;
        color: $dark-avatar
      }

      &.inactive {
        opacity: .5;
        color: $disabled-gray;

        path[pid="1"] {
          stroke: transparent;
          fill: $disabled-gray !important;
        }
      }
    }
  }
</style>
