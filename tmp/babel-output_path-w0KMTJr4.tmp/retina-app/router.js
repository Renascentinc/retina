define('retina-app/router', ['exports', 'ember', 'retina-app/config/environment'], function (exports, _ember, _retinaAppConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _retinaAppConfigEnvironment['default'].locationType,
    rootURL: _retinaAppConfigEnvironment['default'].rootURL
  });

  Router.map(function () {
    this.route('transfer');
    this.route('search');
    this.route('add');
    this.route('scan');
  });

  exports['default'] = Router;
});