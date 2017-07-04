import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('loginUser', function(app, assert, username, password) {
    visit('/login');
    andThen(() => {
        assert.equal(currentURL(), '/login', 'was not taken to the login route');

        fillIn('#identification', username);
        fillIn('#password', password);

        click('#login-btn');
    });
});
