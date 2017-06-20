import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({
    session: Ember.inject.service(),

    toolList: [],

    _transferTo: '',

    selectedStatus: '',

    selectedBrand: '',

    selectedType: '',

    _userID: null,

    _query: Ember.computed(function() {
        return {
            currentUser: this.get('session').get('data.currentUserID'),
            status: this.getWithDefault('selectedStatus', ''),
            brand: this.getWithDefault('selectedBrand', ''),
            type: this.getWithDefault('selectedType', ''),
            userID: this.getWithDefault('_userID', '')
        };
    }).volatile(),

    actions: {
        goToInfoPage() {
            let toolid = Ember.$('#toolid').val();
            this.get('target').transitionTo('info', toolid);
        },

        addToList(toolid) {
            if (!this.toolList.includes(toolid)) {
                this.get('toolList').pushObject(toolid);
            }
        },

        deleteToolList() {
            this.set('toolList', []);
        },

        transferTools() {
            Ember.$('#user-to-transfer-to').css('border-style', 'none');
            Ember.$('#list-title').css('border-style', 'none');

            if (this._transferTo === '') {
                Ember.$('#user-to-transfer-to').css('border-style', 'solid');
                Ember.$('#user-to-transfer-to').css('border-color', '#e30000');
            }

            if (this.toolList.length === 0) {
                Ember.$('#list-title').css('border-style', 'solid');
                Ember.$('#list-title').css('border-color', '#e30000');
            }

            if (Ember.$('#user-to-transfer-to').val() !== null && this.toolList.length !== 0) {
                let user = parseInt(Ember.$('#user-to-transfer-to').val());
                let _this = this;

                let options = {
                    url: `${config.APP.API_URL}${config.APP.API_NAMESPACE}/transfer`,
                    data: {
                        userid: user,
                        toolids: this.toolList
                    },
                    type: 'PUT',
                    crossDomain: true,
                    success() {
                        alert('Transaction success.');
                    },

                    error() {
                        alert('Tranaction failed.');
                    }
                };

                Ember.$.ajax(options).then(function() {
                    let set = _this.set.bind(_this, 'model.tools');
                    Ember.$.getJSON(`${config.APP.API_URL}${config.APP.API_NAMESPACE}/search`, _this.get('_query')).then(set);
                });

                this.set('toolList', []);
            }
        },

        updateTransferTo(target) {
            this.set('_transferTo', parseInt(target.value));
        }
    }
});
