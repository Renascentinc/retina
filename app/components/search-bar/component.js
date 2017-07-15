import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['search-bar'],

    searchParameter: '',

    showClearSearch: Ember.computed.bool('searchParameter'),

    onInput() { },

    actions: {
        fuzzySearchDebounced() {
            Ember.run.debounce(this, this.onInput, 200);
        },

        clearSearch() {
            this.set('searchParameter', '');
            this.onInput();
        }
    },

    willDestroy() {
        this.set('searchParameter', '');
        if (this.get('usingFuzzySearch')) {
            this.onInput();
        }
    }
});
