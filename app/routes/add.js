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
    },

    afterModel() {
        Ember.$(document).ready(function() {

        let currentYear = new Date().getFullYear();

        Ember.$.validator.addMethod("maxDate", function(value) {
            var curDate = new Date();
            var inputDate = new Date(value);

            if (value.toString() === ""){
               return true;
            } else if (inputDate > curDate){
               return false;
            } else {
               return true;
            }

        });


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
                      required: true,
                      minlength: 3,
                      alphanumeric: true
                   },

                   purchasedate:{
                      maxDate: true
                   },

                   serialnumber: {
                      required: true,
                      minlength: 4,
                      alphanumeric: true
                   },

                   status: {
                      required: true
                   },

                   assignee: {
                      required: true
                   },

                   price:{
                      currency: ["$", false]
                   },

                   year: {
                      digits: true,
                      maxlength: 4,
                      minlength: 4,
                      range: [1975, currentYear]
                   }

                },

               messages: {

                   type: {
 						required: "Must Select Type"
 					},

                   brand: {
                      required: "Must Select Brand"
                   },

                   custombrand: {
                      required: "Must Specify Other"
                   },

                   modelnumber: {
                      required: "Must Enter Model Number",
                      minlength: "Must Enter Valid Model Number",
                      alphanumeric: "Only numbers and letters allowed"
                   },

                   serialnumber: {
                      required: "Enter Serial Number",
                      minlength: "Enter Valid Serial Number",
                      alphanumeric: "Only numbers and letters allowed"
                   },

                   purchasedate:{
                      maxDate: "Purchase Dates Must Be In The Past"
                   },

                   status: {
                      required: "Must Assign Status"
                   },

                   assignee: {
                      required: "Must Assign Tool"
                   },

                   price: {
                      currency: "Must Be Valid Price"
                   },

                   year: {
                      digits: "Must Be Valid Year",
                      maxlength: "Must Be Valid 4 Digit Year",
                      minlength: "Must Be Valid 4 Digit Year"
                   }
 				}
 			});
        });
    }
});
