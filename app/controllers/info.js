import Ember from 'ember';
import roleUtils from '../utils/user-roles';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),
    cache: Ember.inject.service('data-cache'),

    dropdown: Ember.computed.alias('cache.dropdown'),

    actions: {
        updateStatus(tool) {
            let newStatus = Ember.$('#status').val();

            if (newStatus !== '') {
                tool.set('status', newStatus);
                tool.save();
            }
        }
    },

    ableToTransfer: Ember.computed('model', function() {
        let isOwnedByUser = this.get('session.data.currentUserID') === this.get('model.userid');
        let isAdmin = roleUtils.isAdmin(this.get('session.data'));
        let isInShop = this.get('model.username') === 'The Shop';

        return isOwnedByUser || isAdmin || isInShop;
    })
});
