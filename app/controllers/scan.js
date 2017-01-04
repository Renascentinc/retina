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
                Ember.$("#list").append("<span id=z"+toolid+"><span class='glyphicon glyphicon-remove-sign delete-icon' aria-hidden='true' {{action 'deleteToolFromList' z"+toolid+"}}></span>    "+ toolid + "<br></span>");
            }
		},
		
		deleteToolFromList(id){
			console.log("howdy");
			toolList.splice(id);
			$("#"+id).remove();
			console.log(id+"is removed");
		},
        
        transferTools() {
            let userid = 0;
            const options = {
                processData: false,
                url: '/transfer',
                data: { userid: userid, toolids: this.toolList },
                method: 'PUT',
                dataType: 'json',
                accept: 'application/json',
                headers: {
                "Content-Type": 'application/json'
                }
            };
            
            Ember.$.ajax(options);
            Ember.$("#list").html("");
            this.toolList = [];
        }
    }

});
