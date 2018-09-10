import Ember from 'ember';

export default Ember.Service.extend({
  nfcExists: false,

  nfcCallback() {},

  _nfcCallback(param) {
    let value;
    if (param.tag.ndefMessage) {
      let [{ payload }] = param.tag.ndefMessage;
      value = String.fromCharCode(...payload).slice(3);
    }
    this.nfcCallback(value);
  },

  init() {
    this.set('nfcExists', Ember.isPresent(window.nfc));
    if (this.get('nfcExists')) {
      window.nfc.addNdefListener(Ember.run.bind(this, this._nfcCallback));
    }
  }
});
