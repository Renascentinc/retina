import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Component.extend({
    classNames: ['search-header'],

    session: Ember.inject.service('session'),

    showSelectTools: false,

    userOptions: Ember.computed(function() {
        if (this.get('showSelectTools')) {
            return this.get('model.selectUsers.users');
        } else {
            return this.get('model.dropdown.user');
        }
    }),

    clearFilterParams() {
        this.set('query.status', '');
        this.set('query.brand', '');
        this.set('query.type', '');
        this.set('query.userID', '');
    },

    actions: {
        goToInfoPage() {
            let toolid = Ember.$('#toolid').val();
            this.get('target').transitionTo('info', toolid);
        },

        updateSearch(target) {
            Ember.$('.search-box').val('');

            if (target.getAttribute('name') === 'status') {
                this.set('query.status', target.value);

            } else if (target.getAttribute('name') === 'brand') {
                this.set('query.brand', target.value);

            } else if (target.getAttribute('name') === 'type') {
                this.set('query.type', target.value);

            } else if (target.getAttribute('name') === 'owner') {
                this.set('query.userID', parseInt(target.value));
            }

            let set = this.set.bind(this, 'model.tools');
            Ember.$.getJSON(`${config.APP.API_URL}${config.APP.API_NAMESPACE}/search`, this.get('query')).then(set);
        },

        fuzzySearch(value) {
            this.clearFilterParams();
            let set = this.set.bind(this, 'model.tools');
            let user = this.get('session').get('data.currentUserID');

            if (value !== '') {
                Ember.$.getJSON(`${config.APP.API_URL}${config.APP.API_NAMESPACE}/search`, {
                    currentUser: user,
                    parameter: value
                }).then(set);
            } else {
                Ember.$.getJSON(`${config.APP.API_URL}${config.APP.API_NAMESPACE}/search`, this.get('query')).then(set);
            }
        }
    }
});
