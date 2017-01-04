import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),
    actions: {
        saveNewTool(tool) {
            let brand = Ember.$('#brand').val();
            let type = Ember.$('#type').val();
            let purchasedfrom = Ember.$('#purchasedfrom').val();
            let status = Ember.$("#status").val();
            let assignee = Ember.$("#assignee").val();
            
            tool.set('brand', brand);
            tool.set('type', type);
            tool.set('purchasedfrom', purchasedfrom);
            tool.set('status', status);
            tool.set('userid', assignee);
            
            tool.save().then(function(tool) {
//                self.transitionTo('info', tool.get('id') );
                alert( tool.get('id') );
            }).catch(function(e) {
                alert( e );
            });
        }
    }
});
