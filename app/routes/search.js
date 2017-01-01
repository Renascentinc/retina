import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model() {
		return Ember.RSVP.hash({
			tools: this.get('store').findAll('tool'),
			status: Ember.$.getJSON('/status'),
			owners: this.get('store').findAll('owner'),
			types: Ember.$.getJSON('/type')
		});
	}
});