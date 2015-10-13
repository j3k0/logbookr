(function (root, isBrowser) {
  "use strict";

  var definition = function (require) {
    var backbone = require('backbone');
    var underscore = require('underscore');
    // var templateText = require('./text!./editableView.html');
    var tr = require('../tr');

    return backbone.View.extend({
      template: underscore.template('<pre><%- JSON.stringify(procedure, null, 2) %></pre>'),

      render: function () {
        this.$el.html(this.template({
          procedure: this.model.toJSON(),
          tr: tr
        }));

        return this;
      }
    });
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
