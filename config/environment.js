/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'retina-app',
    environment: environment,
    rootURL: '/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV.APP.api_namespace = 'api';

  if (environment === 'development') {
      ENV.APP.api_url = 'https://retina-api-develop.azurewebsites.net/';
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'development-local-api') {
    ENV.APP.api_url = 'http://localhost:8080/';

    ENV['ember-cli-mirage'] = {
        enabled: false
    };
  }

  if (environment === 'test') {
    ENV.APP.api_url = 'https://retina-api-develop.azurewebsites.net/';

    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
      ENV.APP.api_url = 'https://retina-api.azurewebsites.net/';
  }

  ENV.contentSecurityPolicy = {
  'default-src': "'none'",
  'script-src': ["'self'"],
  'font-src': ["'self'"],
  'connect-src': ["https://retina-api-develop.azurewebsites.net"],
  'img-src': "'self'",
  'style-src': ["'self'"],
  'media-src': null
}

  ENV['ember-cli-mirage'] = {
      enabled: false
  };

  return ENV;
};
