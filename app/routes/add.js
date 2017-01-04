import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model() {
        return Ember.RSVP.hash({
            tools: this.get('store').createRecord('tool'),
            brands: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/brands'),
            types: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/types'),
            providers: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/providers'),
            status: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/status'),
            users: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/users')
        });
    }
});