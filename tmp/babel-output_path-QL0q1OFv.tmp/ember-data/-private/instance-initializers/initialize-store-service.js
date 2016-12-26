define('ember-data/-private/instance-initializers/initialize-store-service', ['exports'], function (exports) {
  'use strict';

  exports['default'] = initializeStoreService;

  /*
   Configures a registry for use with an Ember-Data
   store.
  
   @method initializeStoreService
   @param {Ember.ApplicationInstance} applicationOrRegistry
   */
  function initializeStoreService(application) {
    var container = application.lookup ? application : application.container;
    // Eagerly generate the store so defaultStore is populated.
    container.lookup('service:store');
  }
});