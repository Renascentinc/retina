import Ember from 'ember';

export default Ember.Route.extend({
	model(params) {
		return Ember.RSVP.hash({ 
			tool: this.get('store').createRecord('tool'),
			tools: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/tools/'+params.id),
			status: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/status')
		
		});
	}
});
