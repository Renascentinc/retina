import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Component.extend({
    classNames: ['search-header'],

    session: Ember.inject.service('session'),

    showSelectTools: false,

    clearFilterParams() {
        this.set('selectedStatus', '');
        this.set('selectedBrand', '');
        this.set('selectedType', '');
        this.set('_userID', null);
    },

    _query: Ember.computed(function() {
        let query = {
            status: this.getWithDefault('selectedStatus', ''),
            brand: this.getWithDefault('selectedBrand', ''),
            type: this.getWithDefault('selectedType', ''),
            userID: this.getWithDefault('_userID', '')
        }

        if (this.get('showSelectTools')) {
            query.currentUser = this.get('session').get('data.currentUserID')
        }

        return query;
    }).volatile(),

    actions: {
        goToInfoPage() {
            let toolid = Ember.$('#toolid').val();
            this.get('target').transitionTo('info', toolid);
        },

        updateSearch(target) {
            Ember.$('.search-box').val('');

            if (target.getAttribute('name') === 'status') {
                this.set('selectedStatus', target.value);

            } else if (target.getAttribute('name') === 'brand') {
                this.set('selectedBrand', target.value);

            } else if (target.getAttribute('name') === 'type') {
                this.set('selectedType', target.value);

            } else if (target.getAttribute('name') === 'owner') {
                this.set('_userID', parseInt(target.value));
            }

            let set = this.set.bind(this, 'model.tools');
            Ember.$.getJSON(`${config.APP.API_URL}${config.APP.API_NAMESPACE}/search`, this.get('_query')).then(set);
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
                Ember.$.getJSON(`${config.APP.API_URL}${config.APP.API_NAMESPACE}/search`, this.get('_query')).then(set)
            }
        }
    }
});
