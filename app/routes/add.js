import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model() {
        return Ember.RSVP.hash({
            tool: this.get('store').createRecord('tool'),
            dropdown: this.get('store').queryRecord('dropdown', {
                currentUser: 0,
                brand: true,
                type: true,
                provider: true,
                status: true,
                user: true,
                restricteduser: false
            })
        });
    },

    afterModel() {
        Ember.$(document).ready(function () {
            let currentYear = new Date().getFullYear();
            Ember.$("#form").validate({
                rules: {
                    type: {
                        required: true
                    },

                    brand: {
                        required: true
                    },

                    custombrand: {
                        required: true,
                        maxlength: 40
                    },

                    customprovider: {
                        required: true,
                        maxlength: 40
                    },

                    modelnumber: {
                        required: true,
                        minlength: 3,
                        maxlength: 40,
                        alphanumeric: true
                    },

                    purchasedate: {
                        maxDate: true
                    },

                    serialnumber: {
                        required: true,
                        minlength: 4,
                        maxlength: 40,
                        alphanumeric: true
                    },

                    status: {
                        required: true
                    },

                    assignee: {
                        required: true
                    },

                    price: {
                        currency: ["$", false],
                        maxlength: 40
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
                        required: "Must Specify Other Brand"
                    },

                    customprovider: {
                        required: "Must Specify Other Provider"
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

                    purchasedate: {
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
            //----------End validation--------------
        });
    }
});
