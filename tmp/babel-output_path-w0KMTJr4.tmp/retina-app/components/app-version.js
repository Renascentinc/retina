define('retina-app/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'retina-app/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _retinaAppConfigEnvironment) {

  var name = _retinaAppConfigEnvironment['default'].APP.name;
  var version = _retinaAppConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});