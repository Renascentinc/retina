import DS from 'ember-data';

export default DS.Model.extend({
	brand: DS.attr(),
	type: DS.attr(),
	ownerfirstname: DS.attr(),
	ownerlastname: DS.attr(),
	datelastcheckout: DS.attr(),
	purchasedate: DS.attr(),
    price: DS.attr(),
    modelnumber: DS.attr()
});
