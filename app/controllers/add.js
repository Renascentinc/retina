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
          let status = Ember.$("#status").val();
          let assignee = Ember.$("#assignee").val();

          if(brand === '-1') {
              brand = Ember.$('#custom-brand').val();
          }

          if(purchasedfrom === '-1') {
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

          let _this = this;

          tool.save().then(function(tool) {
              let toolid = tool.get('id');
              _this.set('isAddingTool', false);
              _this.get('target').transitionTo('info', toolid);

          }).catch(function(e) {
              _this.set('isAddingTool', false);
              console.log( e );
          });
      },

      addCustomOptions(dropdownid, textfieldid){
        Ember.$(dropdownid).change(function(){
          if(Ember.$(this).val() === '-1'){
            Ember.$(textfieldid).fadeIn();

          } else {
            Ember.$(textfieldid).fadeOut();
            }
        });
          }
      }
});
