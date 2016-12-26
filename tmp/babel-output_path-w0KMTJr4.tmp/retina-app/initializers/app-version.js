define('retina-app/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'retina-app/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _retinaAppConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_retinaAppConfigEnvironment['default'].APP.name, _retinaAppConfigEnvironment['default'].APP.version)
  };
});