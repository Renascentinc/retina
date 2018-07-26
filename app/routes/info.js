import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import config from '../config/environment';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  nfc: Ember.inject.service(),

	model(params) {
		return Ember.RSVP.hash({
            tool: this.get('store').findRecord('tool', params.id),
			status: Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/status')
		});
	},

  setupController(controller, model) {
    this._super(controller, model);
    this.set('nfc.nfcCallback', () => {});
  }
});
