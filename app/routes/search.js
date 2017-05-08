import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model() {
		return Ember.RSVP.hash({
      		tool: this.get('store').query('tool', {status: '', userID: '', type: '', brand: ''}),
      		dropdown: this.get('store').queryRecord('dropdown', {currentUser: 0, brand: true, type: true, provider: false, status: true, user: true, restricteduser: false})
		});
	}
});
