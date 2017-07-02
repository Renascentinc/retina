import Ember from 'ember';
<<<<<<< HEAD

export default Ember.Mixin.create({
    session: Ember.inject.service(),
    cache: Ember.inject.service('data-cache'),

    dropdown: Ember.computed.alias('cache.dropdown'),

    tools: Ember.computed('_tools', function() {
        if (this.get('_tools')) {
            return this.get('_tools');
        }

        return this.get('store').query('tool', this.get('query')).then((response) => {
            this.set('_tools', response);
        });
    }),

=======
import config from '../config/environment';

export default Ember.Mixin.create({
>>>>>>> develop
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

<<<<<<< HEAD
    updateSearch(body) {
        this.get('store').query('tool', body).then((response) => {
            this.set('_tools', response);
        });
=======
    actions: {
        updateSearch(body) {
            let set = this.set.bind(this, 'model.tools');
            Ember.$.getJSON(`${config.APP.API_URL}/${config.APP.API_NAMESPACE}/search`, body).then(set);
        }
>>>>>>> develop
    }
});
