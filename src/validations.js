(function (root, isBrowser) {
  "use strict";

  var definition = function () {
    var isString = function (minLength, val) {
      if (arguments.length !== 2) {
        val = minLength;
        minLength = 0;
      }

      return ('string' === typeof val) && (val.length >= minLength);
    };

    return {
      isString: isString,
      isNonEmptyString: isString.bind(null, 1)
    };
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
