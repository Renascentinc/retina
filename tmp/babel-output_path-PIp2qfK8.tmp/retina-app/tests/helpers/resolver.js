define('retina-app/tests/helpers/resolver', ['exports', 'retina-app/resolver', 'retina-app/config/environment'], function (exports, _retinaAppResolver, _retinaAppConfigEnvironment) {

  var resolver = _retinaAppResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _retinaAppConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _retinaAppConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});