import Ember from 'ember';
import config from '../config/environment';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model() {
		return Ember.RSVP.hash({
      tools: Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/search?status=&userID=&type=&brand='),
      dropdown: this.get('store').queryRecord('dropdown', {currentUser: 0, brand: true, type: true, provider: false, status: true, user: true, restricteduser: false})
		});
	}
});
