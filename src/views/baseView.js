(function (root, isBrowser) {
  "use strict";

  var definition = function (require) {
    var backbone = require('backbone');
    var underscore = require('underscore');

    return backbone.View.extend({}, {
      extend: function (instanceProps/*, classProps*/) {
        instanceProps.events = underscore.extend({}, this.prototype.events, instanceProps.events);
        return backbone.View.extend.apply(this, Array.prototype.slice.call(arguments, 0));
      }
    });
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
