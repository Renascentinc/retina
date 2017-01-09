import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import config from '../config/environment';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model() {
        return Ember.RSVP.hash({
            tool: this.get('store').createRecord('tool'),
            brands: Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/brands'),
            types: Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/types'),
            providers: Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/providers'),
            status: Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/status'),
            users: Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/users')
        });
    }
});