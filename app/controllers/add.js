import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),
    actions: {
        saveNewTool(tool) {
            let brand = Ember.$('#brand').val();
            let type = Ember.$('#type').val();
            let purchasedfrom = Ember.$('#purchasedfrom').val();
            
            tool.set('ownerfirstname', 'Billy');
            tool.set('ownerlastname', 'Boyd');
            tool.set('datelastcheckout', tool.get('purchasedate'));
            tool.set('brand', brand);
            tool.set('type', type);
            tool.set('purchasedfrom', purchasedfrom);
            tool.set('id', this.get('session').get('data.currentUserID'));
            
            tool.save();
        }
    }
});
