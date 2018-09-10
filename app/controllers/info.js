import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  nfc: Ember.inject.service(),

  showModal: false,

  ableToTransfer: Ember.computed('model', function() {
    let isOwnedByUser = this.get('session').get('data.currentUserID') === this.get('model.tool').get('userid');
    let isShopManager = this.get('isAdmin');

    return isOwnedByUser || isShopManager;
  }),

  isAdmin: Ember.computed('session', function() {
    return this.get('session.data.currentUserRole') === 'Administrator';
  }),

  canEncodeTag: Ember.computed('nfc.nfcExists', 'isAdmin', function() {
    return this.get('nfc.nfcExists') && this.get('isAdmin');
  }),

  actions: {
    updateStatus(tool) {
      let newStatus = Ember.$('#status').val();

      if (newStatus !== '') {
        tool.set('status', newStatus);
        tool.save();
      }
    }
  },

  closeModal() {
    this.set('showModal', false);
    this.set('nfc.nfcCallback', () => {});
  },

  goToInfoPage(toolId) {
    this.get('target').transitionTo('info', toolId);
  },

  prepareForEncodeNFCTag() {
    this.set('nfc.nfcCallback', Ember.run.bind(this, this.encodeNFCTag));
    this.set('showModal', true);
  },

  encodeNFCTag(tag) {
    window.console.log(tag);
    let toolId = this.get('model.tool.id');

    const record = [
      window.ndef.textRecord(`${toolId}`)
    ];

    const failure = (reason) => {
      alert(reason);
      this.closeModal();
    };

    const lockSuccess = () => {
      alert('Success');
      this.closeModal();
    };

    const lock = () => {
      window.nfc.makeReadOnly(lockSuccess, failure);
      this.closeModal();
    };

    window.nfc.write(record, lock, failure);
  }
});
