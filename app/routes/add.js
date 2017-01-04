import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model() {
        return Ember.RSVP.hash({
            tool: this.get('store').createRecord('tool'),
            brands: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/brands'),
            types: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/types'),
<<<<<<< HEAD
            providers: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/providers')
=======
            providers: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/providers'),
            status: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/status'),
            users: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/users')
>>>>>>> josiahc.add-page-fixes
        });
    }
});