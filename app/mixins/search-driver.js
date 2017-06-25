import Ember from 'ember';
import config from '../config/environment';

export default Ember.Mixin.create({
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
        let _this = this;
        Ember.$.getJSON(`${config.APP.API_URL}${config.APP.API_NAMESPACE}/search`, body).then((response) => {
            _this.set('tools', response);
        });
    }
});
