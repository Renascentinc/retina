import Ember from 'ember';

export default Ember.Service.extend({
    session: Ember.inject.service(),
    store: Ember.inject.service(),

    _dropdown: null,

    dropdown: Ember.computed('_dropdown', function() {
        if (this.get('_dropdown')) {
            return this.get('_dropdown');
        } else {
            return this.get('store').queryRecord('dropdown', {
                currentUser: this.get('session').get('data.currentUserID'),
                brand: true,
                type: true,
                provider: true,
                status: true,
                user: true,
                restricteduser: true
            }).then((response) => {
                this.set('_dropdown', response);
            });
        }
    })
});
