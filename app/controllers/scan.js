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
		
		addToList(id){
            if( !this.toolList.includes(id) ) {
                this.toolList.push(id);
            }
			console.log( this.toolList );
            Ember.$("#list").append(id + "<br>");
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
