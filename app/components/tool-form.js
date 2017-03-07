import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    saveNewTool(tool) {
        let _this = this;

        tool.save().then(function (tool) {
          let toolid = tool.get('id');
          _this.get('target').transitionTo('info', toolid);

        }).catch(function (e) {
          Ember.Logger.info(e);
        });
    },

    hideCreateOptionOnSameName(term) {
      let existingOption = this.get('model.dropdown.type').includes(term);
      return !existingOption;
    }
  }
});
