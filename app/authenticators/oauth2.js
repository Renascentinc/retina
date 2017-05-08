import Ember from 'ember';
import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
import config from '../config/environment';

export default OAuth2PasswordGrant.extend({
  serverTokenEndpoint: config.APP.api_url + config.APP.api_namespace + '/token',
  session: Ember.inject.service('session'),
    
  makeRequest(url, data) { 
    const options = {
        url: url,
        data: data,
        method: 'POST',
        crossDomain: true
    };

    var $ajaxCall = Ember.$.ajax(options);
    var _this = this;
      
    $ajaxCall.then(function(response) {
        _this.get('session').set('data.currentUserID', parseInt(response.userid));
        _this.get('session').set('data.currentUserRole', response.role);
    });
      
    return $ajaxCall;
  }
});