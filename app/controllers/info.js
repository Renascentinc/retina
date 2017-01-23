import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),
    
    actions: {
		updateStatus(tool) {
			var newStatus = Ember.$("#status").val();

            if( newStatus !== "" ) {
                tool.set('status', newStatus);
                tool.save();
            }
		}
    },
    
    ableToTransfer: Ember.computed('model', function() {
        let isOwnedByUser = this.get('session').get('data.currentUserID') === this.get('model.tool').get('userid');
        let isShopManager = this.get('session').get('data.currentUserRole') === "Shop Manager";
        
        return( isOwnedByUser || isShopManager );
    })
});
