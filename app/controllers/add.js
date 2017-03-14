import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    successfulAdd(toolid) {
      this.get('target').transitionTo('info', toolid);
    }
  }
});
