import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['search-header'],

    showSelectTools: false,

<<<<<<< HEAD
    userOption: Ember.computed(function() {
        if (this.get('showSelectTools')) {
            return 'restricteduser';
        }

        return 'user';
=======
    userOptions: Ember.computed(function() {
        if (this.get('showSelectTools')) {
            return this.get('model.selectUsers.users');
        }

        return this.get('model.dropdown.user');
>>>>>>> develop
    }),

    clearFilterParams() {
        this.set('query.status', '');
        this.set('query.brand', '');
        this.set('query.type', '');
        this.set('query.userID', '');
    },

    fuzzySearch() {
        this.clearFilterParams();

        if (this.get('fuzzySearchParams.parameter') === '') {
            this.get('updateSearch')(this.get('query'));
        } else {
            this.get('updateSearch')(this.get('fuzzySearchParams'));
        }
    },

    willDestroy() {
        this.set('fuzzySearchParams.parameter', '');
    },

    actions: {
        updateFilters(target) {
            if (target.getAttribute('name') === 'status') {
                this.set('query.status', target.value);

            } else if (target.getAttribute('name') === 'brand') {
                this.set('query.brand', target.value);

            } else if (target.getAttribute('name') === 'type') {
                this.set('query.type', target.value);

            } else if (target.getAttribute('name') === 'owner') {
                this.set('query.userID', parseInt(target.value));
            }
            this.set('fuzzySearchParams.parameter', '');
            this.get('updateSearch')(this.get('query'));
        },

        fuzzySearchDebounced(value) {
            this.set('fuzzySearchParams.parameter', value);
            Ember.run.debounce(this, this.fuzzySearch, 200);
        }
    }
});
