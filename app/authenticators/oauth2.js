import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';

export default OAuth2PasswordGrant.extend({

  makeRequest(url, data) { 
    const options = {
        processData: false,
        url: url,
        data: data,
        method: 'POST',
        data: data,
        dataType: 'json',
        accept: 'application/vnd.api+json',
        headers: {
        "Content-Type": 'application/vnd.api+json'
        }
    };

    return Ember.$.ajax(options);
  }
     
});