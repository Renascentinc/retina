import { test } from 'qunit';
import moduleForAcceptance from 'retina-app/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | scan', {
    beforeEach() {
        server.createList('users', 10);
        // TODO: When the number of tools generated was 50, sometimes only 0 or 1 tools
        //       were generated, causing the tests to fail. Adding 100 tools reduces
        //       the probability of that happening.
        server.createList('tool', 100);
        server.create('dropdowns');
    }
});

test('tools can be added and removed from the cart', function(assert) {
    loginUser(assert, 'username', 'password');

    andThen(() => {
        assert.equal(find('.cart-item').length, 0, 'cart was not empty on page load');

        click(find('.tool-search-entry .tool-info').first());

        andThen(() => {
            assert.notEqual(find('.cart-item').length, 0, 'cart was still empty after adding a tool');

            click(find('.remove-tool').first());

            andThen(() => {
                assert.equal(find('.cart-item').length, 0, 'cart was not empty after removing the tool');
            });
        });
    });
});

test('all tools can be removed from the cart using the clear button', function(assert) {
    loginUser(assert, 'username', 'password');

    andThen(() => {
        assert.equal(find('.cart-item').length, 0, 'cart was not empty on page load');

        click(find('.tool-search-entry .tool-info').first());
        click(find('.tool-search-entry .tool-info').last());

        andThen(() => {
            assert.equal(find('.cart-item').length, 2, 'cart was still empty after adding tools');

            click('.clear-cart');

            andThen(() => {
                assert.equal(find('.cart-item').length, 0, 'cart was not empty after removing all tools');
            });
        });
    });
});

test('validation erros are shown when appropriate', function(assert) {
    loginUser(assert, 'username', 'password');

    andThen(() => {
        assert.equal(find('.transfer-validation-error').length, 0, 'incorrect number of validation errors shown');

        click(find('.complete-transfer').first());

        andThen(() => {
            assert.equal(find('.transfer-validation-error').length, 2, 'incorrect number of validation errors shown');
        });
    });
});

test('validation errors clear when you navigate away and come back to the page', function(assert) {
    loginUser(assert, 'username', 'password');

    andThen(() => {
        click(find('.complete-transfer').first());

        andThen(() => {
            assert.equal(find('.transfer-validation-error').length, 2, 'incorrect number of validation errors shown');

            click('#search-icon');
            click('#tool-icon');

            andThen(() => {
                assert.equal(find('.transfer-validation-error').length, 0, 'incorrect number of validation errors shown');
            });
        });
    });
});
