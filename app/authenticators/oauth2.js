import Ember from 'ember';
import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';

export default OAuth2PasswordGrant.extend({
  session: Ember.inject.service('session'),
  makeRequest(url, data) { 
    const options = {
        processData: false,
        url: url,
        data: data,
        method: 'POST',
        dataType: 'json',
        accept: 'application/vnd.api+json',
        headers: {
        "Content-Type": 'application/vnd.api+json'
        }
    };

    var $ajaxCall = Ember.$.ajax(options);
    var _this = this;
      
    $ajaxCall.then(function(response) {
        _this.get('session').set('data.currentUserID', response.userid);
    });
      
    return $ajaxCall;
  }
});