(function (root, isBrowser) {
  "use strict";

  var definition = function (/*require*/) {
    return {
      dataVersion: 2,
      dataPrefix: 'v2.',
      convertedKeys: 'v2.converted'
    };
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
