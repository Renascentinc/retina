cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "phonegap-nfc.NFC",
      "file": "plugins/phonegap-nfc/www/phonegap-nfc.js",
      "pluginId": "phonegap-nfc",
      "runs": true
    },
    {
      "id": "cordova-plugin-splashscreen.SplashScreen",
      "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
      "pluginId": "cordova-plugin-splashscreen",
      "clobbers": [
        "navigator.splashscreen"
      ]
    },
    {
      "id": "cordova-plugin-device.device",
      "file": "plugins/cordova-plugin-device/www/device.js",
      "pluginId": "cordova-plugin-device",
      "clobbers": [
        "device"
      ]
    },
    {
      "id": "cordova-plugin-printer.Printer",
      "file": "plugins/cordova-plugin-printer/www/printer.js",
      "pluginId": "cordova-plugin-printer",
      "clobbers": [
        "plugin.printer",
        "cordova.plugins.printer"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.3",
    "phonegap-nfc": "1.0.3",
    "cordova-plugin-splashscreen": "5.0.2",
    "cordova-plugin-device": "2.0.2",
    "cordova-plugin-printer": "0.7.3"
  };
});