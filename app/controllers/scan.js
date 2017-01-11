import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),
    
    toolList: [],
    

    queryParams: {
        currentUser: 0,
        status: "",
        brand: "",
        type: "",
        userID: ""
    },
    
    actions: {
        goToInfoPage() {
            let toolid = Ember.$("#toolid").val();
            this.get('target').transitionTo('info', toolid);
        },

		goToTransferPage() {
			let toolid = Ember.$("#toolid").val();
			this.get('target').transitionTo('transfer', toolid);
		},

		addToList(toolid){
            if( !this.toolList.includes(toolid) ) {
                this.toolList.push(toolid);
                Ember.$("#list").append(toolid + "<br>");
            }
		},

		deleteToolList(){
			this.toolList.splice(0, this.toolList.length);
			Ember.$("#list").html("");
		},

        transferTools() {
			Ember.$("#user-to-transfer-to").css("border-style", "none");
			Ember.$("#list-title").css("border-style", "none");
			
			if(Ember.$("#user-to-transfer-to").val() === null){
				Ember.$("#user-to-transfer-to").css("border-style", "solid");
				Ember.$("#user-to-transfer-to").css("border-color", "#e30000");
			}
			
			if(this.toolList.length === 0){
				Ember.$("#list-title").css("border-style", "solid");
				Ember.$("#list-title").css("border-color", "#e30000");
			}
			
			if (Ember.$("#user-to-transfer-to").val() !== null && this.toolList.length !== 0){

				
				   var userid = parseInt(Ember.$("#user-to-transfer-to").val());

				   const options = {

					   url: config.APP.api_url + config.APP.api_namespace + '/transfer',
					   data: { userid: userid, toolids: this.toolList},
					   type: 'PUT',
					   crossDomain: true,
					   success: function() {
							alert("Transaction success.");
					   },

					   error: function() {
							alert("Tranaction failed.");
					   }

					};

					Ember.$.ajax(options);

					Ember.$("#list").html("");
					this.toolList = [];
                    
			}
        },
		
        updateSearch( target ) {
			Ember.$(".search-box").val('');
            let params = this.queryParams.get('0');
            params.currentUser = this.get('session').get('data.currentUserID');
            
            if( target.getAttribute('name') === "status" ) {
                params.status = target.value;
                
            } else if( target.getAttribute('name') === "brand" ) {
                params.brand = target.value;
                
            } else if( target.getAttribute('name') === "type" ) {
                params.type = target.value;
                
            } else if( target.getAttribute('name') === "owner" ) {
                params.userID = target.value;
            }
            
            var set = this.set.bind(this, 'model.tools');
            Ember.$.getJSON( config.APP.api_url + config.APP.api_namespace + '/search', params ).then(set);
        },
        
        fuzzySearch(value) {
			
            var set = this.set.bind(this, 'model.tools');
            let currentUser = this.get('session').get('data.currentUserID');
            
            if( value !== "" ) {
				Ember.$(".search-parameter").val('');
                Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/search', { currentUser: currentUser, parameter: value } ).then(set);
            } else {
                Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/search?currentUser=' + currentUser + '&status=&userID=&type=&brand=').then(set);
            }
        }
		

    }

});
