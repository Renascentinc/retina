import Ember from 'ember';

export default Ember.Service.extend({
    notifications: Ember.inject.service('notification-messages'),

    nfcExists: false,

    nfcCallback() {},

    _nfcCallback(param) {
        let [{ payload }] = param.tag.ndefMessage;
        let value = String.fromCharCode(...payload).slice(3);
        this.nfcCallback(value);
    },

    init() {
        this.set('nfcExists', Ember.isPresent(window.nfc));
        if (this.get('nfcExists')) {
            window.nfc.addNdefListener(Ember.run.bind(this, this._nfcCallback));
        }
    }
});
