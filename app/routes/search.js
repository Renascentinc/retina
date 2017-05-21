import Ember from 'ember';
import config from '../config/environment';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(/*AuthenticatedRouteMixin, */{
	model() {
		return Ember.RSVP.hash({
            // tools: Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/search?status=&userID=&type=&brand='),
			 //      status: Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/status'),
			 //      users: Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/users'),
			 //      types: Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/types'),
            // brands: Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/brands')
		});
	}
});
