
import { eq } from 'retina-app/helpers/eq';
import { module, test } from 'qunit';

module('Unit | Helper | eq');

test('it works', function(assert) {
  let result = eq([42, 42]);
  assert.ok(result);
});
