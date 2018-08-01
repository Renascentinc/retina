/* eslint-env node */
'use strict';

module.exports = function(/* environment, appConfig */) {
  // See https://github.com/san650/ember-web-app#documentation for a list of
  // supported properties

  return {
    name: "Retina",
    short_name: "Retina",
    description: "Renascent inc. Asset Tracking Application",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/images/retina_192x192.png",
        type: "image/png",
        sizes: "192x192"
      },
      {
        src: "/images/retina_512x512.png",
        type: "image/png",
        sizes: "512x512"
      }
    ],
    ms: {
      tileColor: '#fff'
    }
  };
}
