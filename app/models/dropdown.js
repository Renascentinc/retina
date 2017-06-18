import DS from 'ember-data';

export default DS.Model.extend({
    user: DS.attr(),
    restricteduser: DS.attr(),
    type: DS.attr(),
    brand: DS.attr(),
    provider: DS.attr(),
    status: DS.attr()
});
