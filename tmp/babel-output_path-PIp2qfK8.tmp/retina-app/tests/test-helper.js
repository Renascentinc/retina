define('retina-app/tests/test-helper', ['exports', 'retina-app/tests/helpers/resolver', 'ember-qunit'], function (exports, _retinaAppTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_retinaAppTestsHelpersResolver['default']);
});