import Ember from 'ember';

export default Ember.Controller.extend({
    toolList: [],
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
           var userid = parseInt(Ember.$("#user-to-transfer-to").val());

           const options = {

               url: 'https://retina-api-develop.azurewebsites.net/api/transfer',
               data: { userid: userid, toolids: this.toolList},
               type: 'PUT',
               crossDomain: true
           };

            Ember.$.ajax(options);
            Ember.$("#list").html("");
            this.toolList = [];
        }
    }

});
