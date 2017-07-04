import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model(params) {
        return Ember.RSVP.hash({
            tool: this.get('store').findRecord('tool', params.id)
        });
    }
});
