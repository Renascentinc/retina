import DS from 'ember-data';

export default DS.Model.extend({
	ownerFirstName: DS.attr(),
	ownerLastName: DS.attr(),
//	toolID: DS.attr('number'),
	dateLastCheckout: DS.attr(),
	purchaseDate: DS.attr()
});
