import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['search-header'],

    showSelectTools: false,

    userOptions: Ember.computed(function() {
        if (this.get('showSelectTools')) {
            return this.get('model.selectUsers.users');
        }

        return this.get('model.dropdown.user');
    }),

    clearFilterParams() {
        this.set('query.status', '');
        this.set('query.brand', '');
        this.set('query.type', '');
        this.set('query.userID', '');
    },

    actions: {
        updateFilters(target) {
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
            this.get('updateSearch')(this.get('query'));
        },

        fuzzySearch(value) {
            this.clearFilterParams();
            this.set('fuzzySearch.parameter', value);

            if (value === '') {
                this.get('updateSearch')(this.get('query'));
            } else {
                this.get('updateSearch')(this.get('fuzzySearch'));
            }
        }
    }
});
