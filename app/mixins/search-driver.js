import Ember from 'ember';
import roleUtils from '../utils/user-roles';

export default Ember.Mixin.create({
    session: Ember.inject.service(),
    cache: Ember.inject.service('data-cache'),

    dropdown: Ember.computed.alias('cache.dropdown'),

    tools: Ember.computed('_tools', function() {
        if (this.get('_tools')) {
            return this.get('_tools');
        } else {
            return this.get('store').query('tool', this.get('query')).then((response) => {
                this.set('_tools', response);
            });;
        }
    }),

    init() {
        this._super(...arguments);

        this.set('query',  {
            status: '',
            brand: '',
            type: '',
            userID: ''
        });

        this.set('fuzzySearchParams', {
            parameter: ''
        });
    },

    updateSearch(body) {
        this.get('store').query('tool', body).then((response) => {
            this.set('_tools', response);
        });
    }
});
