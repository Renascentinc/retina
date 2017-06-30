import Ember from 'ember';
import SearchMixin from '../mixins/search-driver';

export default Ember.Controller.extend(SearchMixin, {
    init() {
        this._super(...arguments);
        // this.updateSearch(this.get('query'));
    }
});
