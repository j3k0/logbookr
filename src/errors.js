(function (root, isBrowser) {
  "use strict";

  var definition = function () {
    return {
      validationError: function (message) {
        return 'ValidationError: ' + message;
      }
    };
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
