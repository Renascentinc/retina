import Ember from 'ember';
import config from '../config/environment';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    session: Ember.inject.service('session'),

	model() {
		return Ember.RSVP.hash({
      tools: Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/search?currentUser=' + this.get('session').get('data.currentUserID') + '&status=&userID=&type=&brand='),
      // tool: this.get('store').query('tool', {status: '', userID: '', type: '', brand: ''}),
      dropdown: this.get('store').queryRecord('dropdown', {currentUser: this.get('session').get('data.currentUserID'), brand: true, type: true, provider: true, status: true, user: true, restricteduser: true})
		});
	},

    deactivate() {
        this.controller.toolList = [];
    }
});
