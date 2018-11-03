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

    <modal
      :width="300"
      :height="220"
      class="ready-to-scan-modal"
      name="ready-to-scan-modal"
      @before-close="pauseNfcListener">
      <div class="modal-content">
        <span class="header-text"> READY TO SCAN </span>

        <svgicon
          icon="nfc"
          width="125"
          height="125">
        </svgicon>

        <button
          class="cancel-btn"
          @click="() => $modal.hide('ready-to-scan-modal')">
          CANCEL
        </button>
      </div>
    </modal>

    <modal
      :width="300"
      :height="120"
      class="nfc-not-supported-modal"
      name="nfc-not-supported-modal"
      @before-close="cancelListener">
      <div class="modal-content">
        <span class="header-text"> NFC Not Available </span>

        <span class="body-text">Please Use The Mobile App on an iOS or Android Phone</span>

        <button
          class="cancel-btn"
          @click="() => $modal.hide('nfc-not-supported-modal')">
          CLOSE
        </button>
      </div>
    </modal>
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
      this.onScan(value)
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

    .ready-to-scan-modal,
    .nfc-not-supported-modal {
      .header-text {
        font-size: 25px;
        font-weight: 900;
        color: #4c4c4c;
      }

      .body-text {
        font-size: 12px;
      }

      .modal-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        height: 100%;

        .cancel-btn {
          font-size: 15px;
          font-weight: 900;
          color: $renascent-dark-gray;
          border: solid 1px $renascent-dark-gray;
          border-radius: 10px;
          padding: 0px 10px;
          margin-bottom: 10px;
        }
      }
    }
  }
</style>
