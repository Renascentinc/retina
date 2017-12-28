import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),

    actions: {
        invalidateSession() {
            this.get('session').invalidate();
        }
    },

    isLoginRoute: Ember.computed('currentRouteName', function() {
        return this.get('currentRouteName') === 'login';
    })
});
