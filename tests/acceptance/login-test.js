import { test, skip } from 'qunit';
import moduleForAcceptance from 'retina-app/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | login');

test('visiting /login', function(assert) {
    visit('/login');

    andThen(() => {
        assert.equal(currentURL(), '/login');
    });
});

skip('try logging in', function(assert) {
    visit('/login');
    andThen(() => {
        assert.equal(currentURL(), '/login');

        fillIn('#identification', 'username');
        fillIn('#password', 'password');

        click('#login-btn');

        andThen(() => {
            assert.equal(currentURL(), '/scan');
        });
    });
});
