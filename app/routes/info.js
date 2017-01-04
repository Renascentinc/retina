import Ember from 'ember';

export default Ember.Route.extend({
	model(params) {
		return Ember.RSVP.hash({ 
		
			tools: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/search?parameter=3'),
			brands: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/brands')
		
		});
	}
});
