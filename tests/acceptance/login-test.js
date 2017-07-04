import { test } from 'qunit';
import moduleForAcceptance from 'retina-app/tests/helpers/module-for-acceptance';
import Ember from 'ember';

moduleForAcceptance('Acceptance | login');

test('The first page I am sent to is the login page', function(assert) {
    visit('/');

    andThen(() => {
        assert.equal(currentURL(), '/login', 'was not taken to the login route');
    });
});

test('The default page after login is the transfer page', function(assert) {
    loginUser(assert, 'username', 'password');

    andThen(() => {
        Ember.run.later(() => {
            assert.equal(currentURL(), '/scan', 'was not taken to the transfer page');
        }, 1000);
    });
});

test('If the password is invalid you see the invalid password message', function(assert) {
    loginUser(assert, 'bad', 'Password');

    andThen(()=> {
        Ember.run.later(() => {
            assert.equal(find('.login-fail').first().text().trim(), 'Invalid Username/Password');
        }, 1000);
    });
});
