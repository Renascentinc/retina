import Ember from 'ember';

export default Ember.Mixin.create({
    session: Ember.inject.service(),
    cache: Ember.inject.service('data-cache'),

    dropdown: Ember.computed.alias('cache.dropdown'),

    usingFuzzySearch: false,

    tools: Ember.computed('_tools', function() {
        if (this.get('_tools')) {
            return this.get('_tools');
        }

        return this.updateSearch(this.get('query'));
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
        return this.get('store').query('tool', body).then((response) => {
            this.set('_tools', response);
        });
    },

    clearFilterParams() {
        this.set('query.status', '');
        this.set('query.brand', '');
        this.set('query.type', '');
        this.set('query.userID', '');
    },

    actions: {
        onFuzzySearch() {
            if (this.get('fuzzySearchParams.parameter') === '') {
                this.updateSearch(this.get('query'));
            } else {
                this.clearFilterParams();
                this.set('usingFuzzySearch', true);
                this.updateSearch(this.get('fuzzySearchParams'));
            }
        },

        onFilterChange() {
            this.set('fuzzySearchParams.parameter', '');
            this.set('usingFuzzySearch', false);

            this.updateSearch(this.get('query'));
        }
    }
});
