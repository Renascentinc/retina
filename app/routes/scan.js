import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    deactivate() {
        this._super(...arguments);
        this.controller.set('showErrorMessages', false);
    }
});
