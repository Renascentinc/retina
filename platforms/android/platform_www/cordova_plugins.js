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
  },
  {
    "id": "cordova-plugin-camera.Camera",
    "file": "plugins/cordova-plugin-camera/www/CameraConstants.js",
    "pluginId": "cordova-plugin-camera",
    "clobbers": [
      "Camera"
    ]
  },
  {
    "id": "cordova-plugin-camera.CameraPopoverOptions",
    "file": "plugins/cordova-plugin-camera/www/CameraPopoverOptions.js",
    "pluginId": "cordova-plugin-camera",
    "clobbers": [
      "CameraPopoverOptions"
    ]
  },
  {
    "id": "cordova-plugin-camera.camera",
    "file": "plugins/cordova-plugin-camera/www/Camera.js",
    "pluginId": "cordova-plugin-camera",
    "clobbers": [
      "navigator.camera"
    ]
  },
  {
    "id": "cordova-plugin-camera.CameraPopoverHandle",
    "file": "plugins/cordova-plugin-camera/www/CameraPopoverHandle.js",
    "pluginId": "cordova-plugin-camera",
    "clobbers": [
      "CameraPopoverHandle"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "phonegap-nfc": "1.0.3",
  "cordova-plugin-splashscreen": "5.0.2",
  "cordova-plugin-device": "2.0.2",
  "cordova-plugin-printer": "0.7.3",
  "cordova-plugin-camera": "4.0.3"
};
// BOTTOM OF METADATA
});