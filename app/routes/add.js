import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model() {
        return Ember.RSVP.hash({
            tool: this.get('store').createRecord('tool'),
            dropdown: this.get('store').queryRecord('dropdown', {currentUser: 0, brand: true, type: true, provider: true, status: true, user: true, restricteduser: false})
        });
    },

    afterModel() {
        Ember.$(document).ready(function() {
        //take date from input field, convert it into a date object, and format
        //it properly
        function parseDate(str) {
          let dateItems = str.split("-");
          return dateItems[1] + "/" + dateItems[2] + "/" + dateItems[0];
        }

        let dateInput = Ember.$("[name=purchasedate]");

        //Change Purchase date field to "date" type on focus
        dateInput.on("focus",function(){
           dateInput.attr("type","date");
        });

        //Change Purchase date field to "text" type on blur and
        //if the input date is not "", convert the input date into
        //a nicer formate
        dateInput.on("blur",function(){
           let originalDate = dateInput.val();

           dateInput.attr("type","text");

           if(originalDate !== ""){
              let finalDate = parseDate(originalDate);
              dateInput.val(finalDate);
           }

        });

        //-------End event handlers----------


        //------Begin Validation-------------

        Ember.$.validator.addMethod("maxDate", function(value) {

           //Per my event handlers above, dates have different formats (##/##/## vs ##-##-##)
           //depending on the type of the input
           let inputType = Ember.$("[name=purchasedate]").attr("type");
           let inputDateArray;
           if (inputType === "date"){
             inputDateArray = value.split("-");
           } else if(inputType === "text"){
             inputDateArray = value.split("/");
           } else {
             console.log("Something broke");
           }
           let curDate = new Date();

            //If the input values is empty, return true.
            //Else, check for valid date.
            //If the check passes, return true
            if (value.toString() === "")
            {
               return true;
            }
            else if (parseInt(inputDateArray[0]) < curDate.getFullYear())
            {
               return true;
            }
            else if (parseInt(inputDateArray[0]) === curDate.getFullYear())
            {
               if (parseInt(inputDateArray[1]) < curDate.getMonth() + 1)
               {
                  return true;
               }
               else if (parseInt(inputDateArray[1]) === curDate.getMonth() + 1)
               {
                  if(parseInt(inputDateArray[2]) < curDate.getDate())
                  {
                     return true;
                  }
                  else if (parseInt(inputDateArray[2]) === curDate.getDate())
                  {
                     return true;
                  }
                  else
                  {
                     return false;
                  }
               }
               else
               {
                  return false;
               }
            }
            else
            {
               return false;
            }
        });

        let currentYear = new Date().getFullYear();

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
      //----------End validation--------------
      });
    }
});
