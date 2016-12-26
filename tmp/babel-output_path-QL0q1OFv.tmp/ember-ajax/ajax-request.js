define('ember-ajax/ajax-request', ['exports', 'ember', 'ember-ajax/mixins/ajax-request'], function (exports, _ember, _emberAjaxMixinsAjaxRequest) {
  'use strict';

  var EmberObject = _ember['default'].Object;

  exports['default'] = EmberObject.extend(_emberAjaxMixinsAjaxRequest['default']);
});