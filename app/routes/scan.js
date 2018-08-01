import Ember from 'ember';
import config from '../config/environment';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    session: Ember.inject.service('session'),
    nfc: Ember.inject.service(),

    model() {
        let _tools = null;
        if (this.controller != null) {
            _tools = Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/search', this.controller.get('_query'));
        } else {
            _tools = Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/search?currentUser=' + this.get('session').get('data.currentUserID') + '&status=&userID=&type=&brand=');
        }

        let _users = null;
        if (this.get('session').get('data.currentUserRole') === 'Administrator') {
            _users = Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/users');
        } else {
            _users = Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/users?currentUser=' + this.get('session').get('data.currentUserID'));
        }

        return Ember.RSVP.hash({
            tools: _tools,
            status: Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/status'),
            selectUsers: _users,
            allUsers: Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/users'),
            types: Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/types'),
            brands: Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/brands')
        });
    },

    setupController(controller, model) {
      this._super(controller, model);
      this.set('nfc.nfcCallback', Ember.run.bind(controller, controller.actions.addToList));
    },

    resetController(controller, isExiting) {
      if (isExiting) {
          this.set('nfc.nfcCallback', () => {});
      }
    }
});
