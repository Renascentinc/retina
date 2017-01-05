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
			$("#list").html("");
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
