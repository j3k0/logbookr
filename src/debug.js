(function (root, isBrowser) {
  "use strict";

  var definition = function () {
    var doNotPrint = isBrowser && (-1 === [
        '127.0.0.1',
        'localhost'
      ].indexOf(root.location.hostname));

    var noop = function () {};

    var print = function (level/*[, args]*/) {
      var args = Array.prototype.slice.call(arguments, 1);
      return console[level].apply(console, args);
    };

    var fn = doNotPrint ? noop : print;

    return ['log', 'info', 'warn', 'error'].reduce(function (bound, level) {
      bound[level] = fn.bind(null, level);
      return bound;
    }, fn.bind(null, 'log'));
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
