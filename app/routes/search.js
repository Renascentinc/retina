import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import config from '../config/environment';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model() {
        let _tools = null;
        if (this.controller != null) {
            _tools = Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/search', this.controller.get('_query'));
        } else {
            _tools = Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/search?status=&userID=&type=&brand=');
        }

        return Ember.RSVP.hash({
            dropdown: this.get('store').queryRecord('dropdown', {
                currentUser: 0,
                brand: true,
                type: true,
                provider: false,
                status: true,
                user: true,
                restricteduser: false
            }),
            tools: _tools
        });
    }
});
