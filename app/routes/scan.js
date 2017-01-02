import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model() {
		return Ember.RSVP.hash({
			tools: this.get('store').findRecord('tool', 222222),
			status: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/status'),
			owners: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/owners'),
			types: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/types')
		});
	}
});