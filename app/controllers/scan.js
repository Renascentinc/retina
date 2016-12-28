import Ember from 'ember';

export default Ember.Controller.extend({
	
	
	myFunc: Ember.computed('currentRouteName', {
      get() {
          var url = window.location.href;
			var result = url.split("?")[1].split("=")[1];
		  	return result;
      }
  })

});
