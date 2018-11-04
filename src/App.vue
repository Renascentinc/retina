<template>
  <div id="app">
    <transition>
      <router-view></router-view>
    </transition>

    <modal
      :width="300"
      :height="220"
      class="ready-to-scan-modal"
      name="ready-to-scan-modal">
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
      name="nfc-not-supported-modal">
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
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import './styles/app';
</style>
