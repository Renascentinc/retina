import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import config from '../config/environment';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    session: Ember.inject.service('session'),

    model() {
        let _tools = null;
        if (this.controller != null) {
            _tools = Ember.$.getJSON(`${config.APP.API_URL}${config.APP.API_NAMESPACE}/search`, this.controller.get('_query'));
        } else {
            _tools = Ember.$.getJSON(`${config.APP.API_URL}${config.APP.API_NAMESPACE}/search?currentUser=${this.get('session').get('data.currentUserID')}&status=&userID=&type=&brand=`);
        }

        let _users = null;
        if (this.get('session').get('data.currentUserRole') === 'Administrator') {
            _users = Ember.$.getJSON(`${config.APP.API_URL}${config.APP.API_NAMESPACE}/users`);
        } else {
            _users = Ember.$.getJSON(`${config.APP.API_URL}${config.APP.API_NAMESPACE}/users?currentUser=${this.get('session').get('data.currentUserID')}`);
        }

        return Ember.RSVP.hash({
            dropdown: this.get('store').queryRecord('dropdown', {
                currentUser: 0,
                brand: true,
                type: true,
                provider: false,
                status: true,
                user: true,
                restricteduser: false
            }),
            tools: _tools,
            selectUsers: _users
        });
    }
});
