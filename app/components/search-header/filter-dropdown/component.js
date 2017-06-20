import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['search-filter-container'],

    displayUsers: false,

    actions: {
        optionSelected(target) {
            this.get('onSearchUpdate')(target);
        }
    }
});
