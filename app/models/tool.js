import DS from 'ember-data';

export default DS.Model.extend({
	brand: DS.attr(),
	type: DS.attr(),
	username: DS.attr(),
	datelastcheckout: DS.attr(),
	purchasedate: DS.attr(),
    price: DS.attr(),
    modelnumber: DS.attr(),
    serialnumber: DS.attr()
});
