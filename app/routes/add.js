import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model() {
        return Ember.RSVP.hash({
            tool: this.get('store').createRecord('tool'),
            brands: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/brands'),
            types: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/types'),
            providers: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/providers'),
            status: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/status'),
            users: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/users')
        });
    },
    
    afterModel() {
        Ember.$(document).ready(function() {
 		   Ember.$("#form").validate({
 				rules: {
 					test: {
 						required: true
 					}
 				}, messages: {
 					test: {
 						required: "Please enter your degree program"
 					}
 				}
 			});
        });
    }
});