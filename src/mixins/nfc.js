import Platforms from '../utils/platforms'

export default {
  beforeDestroy () {
    if (this.nfcListenerAdded) {
      window.nfc.removeNdefListener(this.callback, () => window.console.log('successfully removed listener'), () => window.console.log('NFC: error removing listener'))
    }
  },

  data () {
    return {
      nfcListenerAdded: false,
      nfcListenerEnabled: false,
      callback: (tag) => this._initialNfcCallback(tag)
    }
  },

  computed: {
    isNfcEnabled () {
      return !!window.nfc && window.nfc.enabled
    },

    isNfcWriteEnabled () {
      return this.isNfcEnabled && window.device.platform === Platforms.ANDROID
    }
  },

  methods: {
    checkIsNfcEnabled () {
      return !!window.nfc && window.nfc.enabled
    },

    _nfcCallback (param) {
      let value = ''
      if (param && param.tag && param.tag.ndefMessage) {
        let [{ payload }] = param.tag.ndefMessage
        value = String.fromCharCode(...payload).slice(3)
      }
      this.nfcCallback(value)
    },

    _initialNfcCallback (tag) {
      window.console.log('SCAN')
      if (this.nfcListenerEnabled) {
        this._nfcCallback(tag)
        this.pauseNfcListener()
      }
    },

    startNfcListener (callback) {
      let setup = () => {
        this.nfcListenerEnabled = true

        if (!this.nfcListenerAdded) {
          window.nfc.addNdefListener(this.callback, () => window.console.log('NFC: successfully added listener'), () => window.console.error('NFC: error adding listener'))
          this.nfcListenerAdded = true
        }
      }

      if (window.device.platform === Platforms.IOS) {
        window.nfc.beginSession(setup, () => window.console.error('NFC: error starting session'))
      } else {
        setup()
      }
    },

    pauseNfcListener () {
      this.nfcListenerEnabled = false
    }
  }
}
