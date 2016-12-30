import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        goToInfoPage() {
            let toolid = Ember.$("#toolid").val();
            this.get('target').transitionTo('info', toolid);
        }
    }

});
