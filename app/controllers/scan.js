import Ember from 'ember';

export default Ember.Controller.extend({								   
    actions: {
        goToInfoPage() {
            let toolid = Ember.$("#toolid").val();
            this.get('target').transitionTo('info', toolid);
        },
		
		goToTransferPage() {
			let toolid = Ember.$("#toolid").val();
			this.get('target').transitionTo('transfer', toolid);
		},
		
		addToList(){
			console.log("hello world");
			return 0;
		}
    }

});
