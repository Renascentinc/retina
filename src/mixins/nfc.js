import Platforms from '../utils/platforms'

export default {
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
      if (param.tag.ndefMessage) {
        let [{ payload }] = param.tag.ndefMessage
        value = String.fromCharCode(...payload).slice(3)
      }
      this.nfcCallback(value)
    },

    startNfcListener (callback) {
      let setup = () => window.nfc.addNdefListener(callback || this._nfcCallback.bind(this), () => window.console.log('NFC: successfully added listener'), () => window.console.error('NFC: error adding listener'))

      if (window.device.platform === Platforms.IOS) {
        window.nfc.beginSession(setup, () => window.console.error('NFC: error starting session'))
      } else {
        setup()
      }
    },

    closeNfcListener (callback) {
      window.nfc.removeNdefListener(callback || this._nfcCallback.bind(this), () => window.console.log('successfully removed listener'), () => window.console.log('NFC: error removing listener'))
    }
  }
}
