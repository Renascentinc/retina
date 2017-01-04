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
				console.log(toolid.toString());
                Ember.$("#list").append("<div id='"+toolid.toString()+"'><span class='glyphicon glyphicon-remove-sign delete-icon' aria-hidden='true'></span>   "+ toolid + "<br></div>");
            }
		},
		
		deleteToolFromList(id){
			console.log("yoda");
			console.log(id);
			
			this.toolList.splice(id);
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
