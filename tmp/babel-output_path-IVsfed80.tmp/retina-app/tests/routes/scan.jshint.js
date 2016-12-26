define('retina-app/tests/routes/scan.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/scan.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/scan.js should pass jshint.');
  });
});