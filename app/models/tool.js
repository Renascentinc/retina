import DS from 'ember-data';

export default DS.Model.extend({
	ownerfirstname: DS.attr(),
	ownerlastname: DS.attr(),
	datelastcheckout: DS.attr(),
	purchasedate: DS.attr()
});
