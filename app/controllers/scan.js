import Ember from 'ember';
import SearchMixin from '../mixins/search-driver';
import config from '../config/environment';

export default Ember.Controller.extend(SearchMixin, {
    session: Ember.inject.service(),

    toolList: [],

    _transferTo: '',

    query:  {
        currentUser: '',
        status: '',
        brand: '',
        type: '',
        userID: ''
    },

    fuzzySearchParams: {
        currentUser: '',
        parameter: ''
    },

    init() {
        let currentUserId = this.get('session').get('data.currentUserID');
        this.set('query.currentUser', currentUserId);
        this.set('fuzzySearchParams.currentUser', currentUserId);
    },

    actions: {
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

            if (this.get('_transferTo') === '') {
                Ember.$('#user-to-transfer-to').css('border-style', 'solid');
                Ember.$('#user-to-transfer-to').css('border-color', '#e30000');
            }

            if (this.get('toolList').length === 0) {
                Ember.$('#list-title').css('border-style', 'solid');
                Ember.$('#list-title').css('border-color', '#e30000');
            }

            if (Ember.$('#user-to-transfer-to').val() !== null && this.get('toolList').length !== 0) {
                let user = parseInt(Ember.$('#user-to-transfer-to').val());

                let options = {
                    url: `${config.APP.API_URL}${config.APP.API_NAMESPACE}/transfer`,
                    data: {
                        userid: user,
                        toolids: this.get('toolList')
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

                let _this = this;
                Ember.$.ajax(options).then(function() {
                    _this.send('updateSearch', _this.get('query'));
                });

                this.set('toolList', []);
                this.set('_transferTo', '');
            }
        },

        updateTransferTo(target) {
            this.set('_transferTo', parseInt(target.value));
        }
    }
});
