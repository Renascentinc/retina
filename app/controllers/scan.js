import Ember from 'ember';
import SearchMixin from '../mixins/search-driver';
import TransferValidationMixin from '../mixins/transfer-validation';
import roleUtils from '../utils/user-roles';
import config from '../config/environment';

export default Ember.Controller.extend(SearchMixin, TransferValidationMixin, {
    notifications: Ember.inject.service('notification-messages'),

    showErrorMessages: false,

    showSelectTools: Ember.computed(function() {
        return !roleUtils.isAdmin(this.get('session').get('data'));
    }),

    transferInfo: {
        userid: '',
        toolids: Ember.A()
    },

    init() {
        this._super(...arguments);

        let currentUserId = this.get('session').get('data.currentUserID');
        this.set('query.currentUser', currentUserId);
        this.set('fuzzySearchParams.currentUser', currentUserId);

        // this.updateSearch(this.get('query'));
    },

    actions: {
        addToList(toolid) {
            if (!this.get('transferInfo.toolids').includes(toolid)) {
                this.get('transferInfo.toolids').pushObject(toolid);
            }
        },

        deleteToolList() {
            this.set('transferInfo.toolids', Ember.A());
        },

        removeFromList(toolToRemove) {
            let filteredToolList = this.get('transferInfo.toolids').filter((tool) => {
                return tool !== toolToRemove;
            });
            this.set('transferInfo.toolids', filteredToolList);
        },

        transferTools() {
            this.validate().then(({ validations }) => {
                if (validations.get('isValid')) {
                    let _this = this;

                    let options = {
                        url: `${config.APP.API_URL}/${config.APP.API_NAMESPACE}/transfer`,
                        data: this.get('transferInfo'),
                        type: 'PUT',
                        crossDomain: true,
                        success() {
                            _this.get('notifications').success('Transaction success', { autoClear: true, clearDuration: 1000 });
                        },

                        error() {
                            _this.get('notifications').error('Tranaction failed', { autoClear: true, clearDuration: 1000 });
                        }
                    };

                    Ember.$.ajax(options).then(function() {
                        _this.set('transferInfo.toolids', Ember.A());
                        _this.set('transferInfo.userid', '');
                        _this.set('showErrorMessages', false);
                        _this.updateSearch(_this.get('query'));
                    });

                } else {
                    this.set('showErrorMessages', true);
                    this.get('notifications').error('Missing Information', { autoClear: true, clearDuration: 1000 });
                }
            });
        },

        updateTransferTo(target) {
            this.set('transferInfo.userid', parseInt(target.value) || target.value);
        }
    }
});
