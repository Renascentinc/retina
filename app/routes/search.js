import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model() {
		return Ember.RSVP.hash({
<<<<<<< HEAD
            tools: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/search?parameter=3'),
=======
			tools: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/search?parameter=2'),
>>>>>>> josiahc.add-page-fixes
			status: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/status'),
			users: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/users'),
			types: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/types'),
            brands: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/brands')
		});
	}
});