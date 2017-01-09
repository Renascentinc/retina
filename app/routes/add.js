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
 					type: {
 						required: true
 					},

               brand: {
                  required:true
               },

               custombrand: {
                  required: true
               },

               modelnumber: {
                  required: true
               },

               serialnumber: {
                  required: true
               },

               status: {
                  required: true
               },

               assignee: {
                  required: true
               },

               price:{
                  currency: ["$", true]
               },

               year: {
                  digits: true
               }

 				},

            messages: {

               type: {
 						required: "Select type"
 					},

               brand: {
                  required: "Select brand"
               },

               custombrand: {
                  required: "Specify other"
               },

               modelnumber: {
                  required: "Enter model number"
               },

               serialnumber: {
                  required: 'Enter serial number (type 0 if not known)'
               },

               status: {
                  required: "Select status"
               },

               assignee: {
                  required: "Assign tool"
               },

               price:{
                  currency: "dls;kfjdsaf"
               },

               year: {
                  digits: "Digits only"
               }
 				}
 			});
        });
    }
});
