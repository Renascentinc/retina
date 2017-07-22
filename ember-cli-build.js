/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
      sassOptions: {
          includePaths: ['app/components']
      }
  });

  app.import('bower_components/jquery-validation/dist/jquery.validate.min.js');
  app.import('bower_components/jquery-validation/dist/additional-methods.min.js');
  app.import('bower_components/font-awesome/fontawesome-webfont.ttf');
  app.import('bower_components/font-awesome/fontawesome-webfont.woff');
  app.import('bower_components/font-awesome/fontawesome-webfont.woff2');
  app.import('bower_components/jquery-maskmoney/dist/jquery.maskMoney.min.js');

  return app.toTree();
};
