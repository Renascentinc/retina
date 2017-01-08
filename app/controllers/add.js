import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),
    actions: {
		
		toggleField(hideObj, showObj) {
		    hideObj.disabled = true;
		    hideObj.style.display = 'none';
		    showObj.disabled = false;
		    showObj.style.display = 'inline';
		    showObj.focus();
		},
			
        saveNewTool(tool) {
//		   Ember.$("#form").validate({
//				rules: {
//					test: {
//						required: true
//					}
//				},// end rules
//				messages: {
//					test: {
//						required: "Please enter your degree program"
//					}
//				}// end messages
//			});        
        
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
            
            let _this = this;
            
            console.log("saveNewTool");
            return( false );
//            tool.save().then(function(tool) {
//                let toolid = tool.get('id');
//                _this.get('target').transitionTo('info', toolid);
//                
//            }).catch(function(e) {
//                console.log( e );
//            });
        },
		
		addCustomOptions(dropdownid, textfieldid){
			Ember.$(dropdownid).change(function(){
				if(Ember.$(this).val() == '-1'){
					Ember.$(textfieldid).fadeIn();
				}else{
					Ember.$(textfieldid).fadeOut();
			}//end if
			}//end function
		)}
    }
});
