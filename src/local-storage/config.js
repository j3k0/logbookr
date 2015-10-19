(function (root, isBrowser) {
  "use strict";

  var definition = function (/*require*/) {
    return {
      dataVersion: 2,
      dataPrefix: 'v2.',
      safekeepPrefix: 'v2.safekeep.' // data from previous versions is moved
                                     // udner this prefix.
    };
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
