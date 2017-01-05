import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        save(model) {
            console.log(model);
            this.get('model').save();
            
        },
		
		updateStatus() {
			var newStatus = $("#status").val();
			
			tool.set('status', newStatus);
            tool.set('toolid', tool.get('id'));
			tool.set('userid', this.get('session').get('data.currentUserID'));
            
            tool.save();
		}
    }
});
