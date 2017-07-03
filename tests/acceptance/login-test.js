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
    visit('/login');
    andThen(() => {
        assert.equal(currentURL(), '/login', 'was not taken to the login route');

        fillIn('#identification', 'username');
        fillIn('#password', 'password');

        click('#login-btn');

        andThen(() => {
            Ember.run.later(() => {
                assert.equal(currentURL(), '/scan', 'was not taken to the transfer page');
            }, 1000);
        });
    });
});

test('If the password is invalid you see the invalid password message', function(assert) {
    visit('/login');
    andThen(() => {
        assert.equal(currentURL(), '/login', 'was not taken to the login route');

        fillIn('#identification', 'bad');
        fillIn('#password', 'key');

        click('#login-btn');

        andThen(()=> {
            Ember.run.later(() => {
                assert.equal(find('.login-fail').first().text().trim(), 'Invalid Username/Password');
            }, 1000);
        });
    });
});
