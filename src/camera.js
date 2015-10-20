(function (root, isBrowser, isCordova) {
  "use strict";

  // TODO:
  // this module is a lie.

  var definition = function (require) {
    // Let's wrap camera stuff into callback function, something like:
    //  callback(err, pictrure)
    // picture being {url: '', legend: ''} and error is Error or null
    var errors = require('./errors');
    var tr = require('./tr');

    if (!isCordova) {
        return {
          takePicture: function (callback) {
            // for now, return no error, random photo
            var photos = [
              { url: 'http://www.newton.ac.uk/files/covers/968361.jpg',
                legend: 'some random picture' },
              { url: 'http://www.miataturbo.net/attachments/insert-bs-here-4/35220d1330303876-random-pictures-thread-sfw-joe-stones-pony-random-shots-059-jpg',
                legend: 'internet is great!' },
              { url: 'http://images4.fanpop.com/image/photos/17600000/Awesome-random-17652989-500-278.jpg',
                legend: 'another masterpice!' },
              { url: 'http://www.hpl.hp.com/research/info_theory/AlbertWeb/fullsize/B)%20Corrupted%20by%20random%20noise,%20bit%20error%20rate%3D0.020.gif',
                legend: 'okay this is a description' }
           ];

            var getRandomInt = function (min, max) {
              return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            var idx = getRandomInt(0, photos.length - 1);
            var pic = photos[idx];

            // simulate async stuff
            setTimeout(callback.bind(null, null, pic), 200);
          }
        };
    }

    return {
        takePicture: function (callback) {
            // var self = this;
            // this.devicePixelRatio = root.devicePixelRatio || 1;

            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType : Camera.PictureSourceType.CAMERA,
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth:  512,
                targetHeight: 512,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            var fail = function (message, alreadyTranslated) {
                var translation;

                if (message === "Camera cancelled.")
                    return callback(null, null);

                if (!alreadyTranslated && (message === "has no access to assets") && (device.platform === 'iOS'))
                    translation = tr('camera.no-access-to-assets');
                else
                    translation = message;

                callback(errors.cameraError(translation));
            };

            var success = function (fileURI) {
                callback(null, {
                    url: fileURI,
                    legend: ''
                });
            };

            if (root.navigator.camera)
                root.navigator.camera.getPicture(success, fail, options);
            else
                fail(tr('camera.no-camera'), true);
        }
    };
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window, !!this.cordova));
