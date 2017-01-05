import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    session: Ember.inject.service('session'),
    
	model() {
		return Ember.RSVP.hash({
            tools: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/search?currentUser=' + this.get('session').get('data.currentUserID') + '&status=&userID=&type=&brand='),
			status: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/status'),
			selectUsers: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/users?currentUser=' + this.get('session').get('data.currentUserID')),
            allUsers: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/users'),
			types: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/types'),
            brands: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/brands')
		});
	}
});