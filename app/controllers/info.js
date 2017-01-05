import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),
    
    actions: {
        save(model) {
            console.log(model);
            this.get('model').save();
            
        },
		
		updateStatus(tool) {
			var newStatus = Ember.$("#status").val();
			alert( "feature in progress" );
//			tool.set('status', newStatus);
//            console.log( tool.get('hasDirtyAttributes') );
//            console.log( tool );
//            tool.set('toolid', tool.get('id'));
//			tool.set('userid', this.get('session').get('data.currentUserID'));
//            this.get('model.tool').save();
		}
    }
});
