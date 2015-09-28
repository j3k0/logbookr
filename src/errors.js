(function (root, isBrowser) {
  "use strict";

  var definition = function () {
    var createError = function (name, message) {
      var e = new Error(message);
      e.name = name;
      return e;
    }

    return {
      validationError: createError.bind(null, 'ValidationError')
    };
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
