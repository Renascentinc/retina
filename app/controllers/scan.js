import Ember from 'ember';

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
			
			if(Ember.$("#user-to-transfer-to").val() == null){
				Ember.$("#user-to-transfer-to").css("border-style", "solid");
				Ember.$("#user-to-transfer-to").css("border-color", "#e30000");
			}
			
			if(this.toolList.length == 0){
				Ember.$("#list-title").css("border-style", "solid");
				Ember.$("#list-title").css("border-color", "#e30000");
			}
			
			if (Ember.$("#user-to-transfer-to").val() != null
		        && this.toolList.length != 0){
				
				   var userid = parseInt(Ember.$("#user-to-transfer-to").val());

				   const options = {

					   url: 'https://retina-api-develop.azurewebsites.net/api/transfer',
					   data: { userid: userid, toolids: this.toolList},
					   type: 'PUT',
					   crossDomain: true,
					   success: function (response) {
							alert("Transaction success.");
					   },

					   error: function (response) {
							alert("Tranaction failed.");
					   }

					};

					Ember.$.ajax(options);

					Ember.$("#list").html("");
					this.toolList = [];
			}
        },
		
        updateSearch( target ) {
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
            Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/search', params ).then(set);
        },
        
        fuzzySearch(value) {
            var set = this.set.bind(this, 'model.tools');
            let currentUser = this.get('session').get('data.currentUserID');
            
            if( value !== "" ) {
				Ember.$(".search-parameter").val( '' );
                Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/search', { currentUser: currentUser, parameter: value } ).then(set);
            } else {
                Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/search?currentUser=' + currentUser + '&status=&userID=&type=&brand=').then(set);
            }
        }
		

    }

});
