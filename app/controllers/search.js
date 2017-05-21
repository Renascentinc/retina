import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({
    queryParams: {
        status: "",
        brand: "",
        type: "",
        userID: ""
    },

    actions: {
        updateSearch( target ) {
			      Ember.$(".search-box").val('');
            let params = this.queryParams.get('0');

            if( target.getAttribute('name') === "status" ) {
                params.status = target.value;

            } else if( target.getAttribute('name') === "brand" ) {
                params.brand = target.value;

            } else if( target.getAttribute('name') === "type" ) {
                params.type = target.value;

            } else if( target.getAttribute('name') === "owner" ) {
                params.userID = target.value;
            }

            var set = this.set.bind(this, 'model.tools');
           // Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/search', params ).then(set);
        },

        fuzzySearch(value) {
            var set = this.set.bind(this, 'model.tools');

            if( value !== "" ) {
				Ember.$(".search-parameter").val('');
            //    Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/search', { parameter: value } ).then(set);
            } else {
              //  Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/search?status=&userID=&type=&brand=').then(set);
            }
        },

		currentUser(){
			return this.get('session').get('data.currentUserID');
		}
    }
});
