import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model() {
        return Ember.RSVP.hash({
            tool: this.get('store').createRecord('tool'),
            brands: ["milwuake", "black & decker", "dewalt", "bosch"],
            types: ["chop saw", "18v drill", "impact driver", "hammer drill"],
            providers: ["jobsite supply", "home depot", "ace hardware", "lowes"]
        });
    }
});