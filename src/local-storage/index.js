(function (root, isBrowser) {
  "use strict";

  var definition = function (require) {
    var backbone = require('backbone');
    var converters = require('./converters');
    var config = require('./config');
    require('backbone.localstorage');

    var LS = function (id) {
      return new backbone.LocalStorage(LS.id(id));
    };

    LS.id = function (id) {
      return config.dataPrefix + id;
    };

    // Convert existing data from previous versions.
    Object.keys(root.localStorage)
      .filter(converters.shouldConvert)
      .forEach(function (key) {
        var item = root.localStorage.getItem(key);
        var converted = converters.convert(key, item);

        // Save converted version.
        if (converted.item !== null)
          root.localStorage.setItem(converted.key, converted.item);

        // Rename old version.
        root.localStorage.setItem(converted.safekeepKey, converted.safekeepItem);
        root.localStorage.removeItem(key);
      });

    return LS;
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
