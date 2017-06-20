import Ember from 'ember';
import config from '../config/environment';

export default Ember.Mixin.create({
    query:  {
        status: '',
        brand: '',
        type: '',
        userID: ''
    },

    fuzzySearch: {
        parameter: ''
    },

    actions: {
        updateSearch(body) {
            let set = this.set.bind(this, 'model.tools');
            Ember.$.getJSON(`${config.APP.API_URL}${config.APP.API_NAMESPACE}/search`, body).then(set);
        }
    }
});
