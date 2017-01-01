import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        save(model) {
            console.log(model);
            this.get('model').save();
            
        }
    }
});
