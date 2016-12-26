define('retina-app/app', ['exports', 'ember', 'retina-app/resolver', 'ember-load-initializers', 'retina-app/config/environment'], function (exports, _ember, _retinaAppResolver, _emberLoadInitializers, _retinaAppConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _retinaAppConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _retinaAppConfigEnvironment['default'].podModulePrefix,
    Resolver: _retinaAppResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _retinaAppConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});