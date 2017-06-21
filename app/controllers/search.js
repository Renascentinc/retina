import Ember from 'ember';
import SearchMixin from '../mixins/search-driver';

export default Ember.Controller.extend(SearchMixin, {
    query:  {
        status: '',
        brand: '',
        type: '',
        userID: ''
    },

    fuzzySearchParams: {
        parameter: ''
    },
});
