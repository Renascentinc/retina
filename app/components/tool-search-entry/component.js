import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['tool-search-entry'],

    _iconCss: Ember.computed(function() {
        if (this.get('displayOptions')) {
            return 'fa-info-circle';
        }

        return 'fa-chevron-right';
    }),

    onResultSelected: () => {}
});
