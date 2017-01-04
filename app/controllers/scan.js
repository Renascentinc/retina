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
                Ember.$("#list").append("<div id='"+toolid.toString()+"' ><span class='glyphicon glyphicon-remove-sign delete-icon' aria-hidden='true' {{action 'deleteToolFromList' '"+toolid+"'}}></span> "+ toolid.toString() + "<br></div>");
            }
		},
		
		deleteToolFromList(id){
			console.log(this.toolList);
			
			console.log("yoda");
			console.log(id);
			
			for (var i=0; i<this.toolList.length; i++){
				if (this.toolList[i] == id){
					this.toolList.splice(i, 1);
				};
			};
			
			
			$("#"+id).remove();
			console.log(id+"is removed");
			console.log(this.toolList);
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
