import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  _maxdate: new Date(),
  isAddingTool: false,

  actions: {
    toggleField(hideObj, showObj) {
      hideObj.disabled = true;
      hideObj.style.display = 'none';
      showObj.disabled = false;
      showObj.style.display = 'inline';
      showObj.focus();
    },

    saveNewTool(tool) {
      this.set('isAddingTool', true);
      let brand = Ember.$('#brand').val();
      let type = Ember.$('#type').val();
      let purchasedfrom = Ember.$('#purchasedfrom').val();
      let status = Ember.$('#status').val();
      let assignee = Ember.$('#assignee').val();

      if (brand === '-1') {
        brand = Ember.$('#custom-brand').val();
      }

      if (purchasedfrom === '-1') {
        purchasedfrom = Ember.$('#custom-purchasedfrom').val();
      }

      if (tool.get('purchasedate') === null) {
        tool.set('purchasedate', '');
      }

      tool.set('brand', brand);
      tool.set('type', type);
      tool.set('purchasedfrom', purchasedfrom);
      tool.set('status', status);
      tool.set('userid', assignee);

      tool.save().then((tool) => {
        let toolid = tool.get('id');
        this.set('isAddingTool', false);
        this.get('target').transitionTo('info', toolid);

      }).catch((e) => {
        this.set('isAddingTool', false);
        window.console.error(e);
      });
    },

    addCustomOptions(dropdownid, textfieldid) {
      Ember.$(dropdownid).change(() => {
        if (Ember.$(this).val() === '-1') {
          Ember.$(textfieldid).fadeIn();

        } else {
          Ember.$(textfieldid).fadeOut();
        }
      });
    }
  }
});
