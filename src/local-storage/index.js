(function (root, isBrowser) {
  "use strict";

  var definition = function (require) {
    var backbone = require('backbone');
    var converters = require('./converters');
    var config = require('./config');
    var initialTemplate = require('./initial-template');
    require('backbone.localstorage');

    var LS = function (id) {
      return new backbone.LocalStorage(LS.id(id));
    };

    LS.id = function (id) {
      return config.dataPrefix + id;
    };

    // This array stores keys we converted on previous runs.
    var convertedKeys = JSON.parse(root.localStorage.getItem(config.convertedKeys) || '[]');
    var convertedNewItems = false;

    var wasNotConvertedPreviously = function (key) {
      return -1 === convertedKeys.indexOf(key);
    };

    // Convert existing data from previous versions.
    Object.keys(root.localStorage)
      .filter(converters.shouldConvert)   // all data that is not current version
      .filter(wasNotConvertedPreviously)  // all data that was not yet converted
      .forEach(function (key) {
        var item = root.localStorage.getItem(key);
        var converted = converters.convert(key, item);

        // Save converted version.
        if (converted.item !== null) {
          root.localStorage.setItem(converted.key, converted.item);

          // Remember we converted this key.
          convertedKeys.push(key);
          convertedNewItems = true;
        }
      });

    // Update convertedKeys array
    if (convertedNewItems)
      root.localStorage.setItem(config.convertedKeys, JSON.stringify(convertedKeys));

    // If there's no template, init it with default from previous version.
    if (root.localStorage.getItem(LS.id('Template')) === null) {
      Object.keys(initialTemplate).forEach(function (name) {
        root.localStorage.setItem(name, initialTemplate[name]);
      });
    }

    return LS;
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
