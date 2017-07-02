import { eq } from 'retina-app/helpers/eq';
import { module, test } from 'qunit';

module('Unit | Helper | eq');

test('it works with numbers', function(assert) {
    let result = eq([42, 42]);
    assert.ok(result);

    result = eq([42, 43]);
    assert.notOk(result);
});

test('it works with strings', function(assert) {
    let result = eq(['test', 'test']);
    assert.ok(result);

    result = eq(['test', 'test1']);
    assert.notOk(result);
});
