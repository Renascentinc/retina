import DS from 'ember-data';

export default DS.Model.extend({
	ownerFirstName: DS.attr('string'),
	ownerLastName: DS.attr('string'),
	toolID: DS.attr('number'),
	dateLastCheckout: DS.attr('string'),
	purchaseDate: DS.attr('string')
});
