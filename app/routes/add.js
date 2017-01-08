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
//        Ember.$.validator.setDefaults({
//            submitHandler: this.saveNewTool
//        });
        
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
		
			console.log("here");
        });
    }
//    ,
//			
//        saveNewTool() {
//             let tool = this.get('tool');
//             let brand = Ember.$('#brand').val();
//             let type = Ember.$('#type').val();
//             let purchasedfrom = Ember.$('#purchasedfrom').val();
//             let status = Ember.$("#status").val();
//             let assignee = Ember.$("#assignee").val();
//             
//             tool.set('brand', brand);
//             tool.set('type', type);
//             tool.set('purchasedfrom', purchasedfrom);
//             tool.set('status', status);
//             tool.set('userid', assignee);
//             
//             let _this = this;
//             
//            console.log("saveNewTool");
//            return( false );
//            tool.save().then(function(tool) {
//                let toolid = tool.get('id');
//                _this.get('target').transitionTo('info', toolid);
//                
//            }).catch(function(e) {
//                console.log( e );
//            });
//        }
});