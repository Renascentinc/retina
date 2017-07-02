import Ember from 'ember';
import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
import config from '../config/environment';

const { isEmpty } = Ember;

export default OAuth2PasswordGrant.extend({
    serverTokenEndpoint: `${config.APP.API_URL}/${config.APP.API_NAMESPACE}/token`,
    session: Ember.inject.service('session'),

    makeRequest(requestUrl, body) {
        let options = {
            url: requestUrl,
            data: body,
            method: 'POST',
            crossDomain: true
        };

        let $ajaxCall = Ember.$.ajax(options);
        let _this = this;

        $ajaxCall.then(function(response) {
            _this.get('session').set('data.currentUserID', parseInt(response.userid));
            _this.get('session').set('data.currentUserRole', response.role);
        });

        return $ajaxCall;
    },

    _validate(data) {
        return !isEmpty(data['access_token']) || !isEmpty(data.ACCESS_TOKEN);
    }
});
