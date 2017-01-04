import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model() {
		return Ember.RSVP.hash({
			tools: { 
                data: [{
                type: 'tool',
                id: '1',
                attributes: {
                  brand: 'Bosch',
                  username: 'George Boole',
                  type: 'hammer drill',
                  status: 'in use'
                }
              }, {
                type: 'tool',
                id: '2',
                attributes: {
                  brand: 'DeWalt',
                  username: 'Mike Flag',
                  type: 'impact driver',
                  status: 'in use'
                }
              }, {
                type: 'tool',
                id: '3',
                attributes: {
                  brand: 'Milwaukee',
                  username: 'Sam Blam',
                  type: 'reciprocating saw',
                  status: 'available'
                }
              }, {
                type: 'tool',
                id: '3',
                attributes: {
                  brand: 'Milwaukee',
                  username: 'Dr. Watt',
                  type: 'reciprocating saw',
                  status: 'available'
                }
              }, {
                type: 'tool',
                id: '234',
                attributes: {
                  brand: 'Milwaukee',
                  username: 'Charlie Delta',
                  type: 'reciprocating saw',
                  status: 'available'
                }
              }, {
                type: 'tool',
                id: '10',
                attributes: {
                  brand: 'Milwaukee',
                  username: 'Charlie Bravo',
                  type: 'reciprocating saw',
                  status: 'available'
                }
              }, {
                type: 'tool',
                id: '5',
                attributes: {
                  brand: 'Milwaukee',
                  username: 'Bob Ross',
                  type: 'reciprocating saw',
                  status: 'available'
                }
              }]
            },
			status: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/status'),
			users: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/users'),
			types: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/types'),
            brands: Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/brands')
		});
	}
});