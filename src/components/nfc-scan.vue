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
import ExtendedFab from '../components/extended-fab'
import Platforms from '../utils/platforms'
import nfc from '../mixins/nfc'
import '../assets/icons/svg/nfc'

export default {
  name: 'NfcScan',

  components: {
    ExtendedFab
  },

  mixins: [nfc],

  props: {
    onScan: {
      type: Function,
      required: true
    }
  },

  methods: {
    nfcCallback (value) {
      if (value) {
        this.onScan(value)
      } else {
        this.$toasted.show('This Tag is Blank')
      }

      if (window.device.platform === Platforms.ANDROID) {
        this.$modal.hide('ready-to-scan-modal')
      }
    },

    onClick () {
      if (this.checkIsNfcEnabled()) {
        this.startNfcListener()

        if (window.device.platform === Platforms.ANDROID) {
          this.$modal.show('ready-to-scan-modal')
        }
      } else {
        this.$modal.show('nfc-not-supported-modal')
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
