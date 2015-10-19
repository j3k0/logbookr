(function (root, isBrowser) {
  "use strict";

  var definition = function (require) {
    var backbone = require('backbone');
    var underscore = require('underscore');
    var templateText = require('./text!./templateShowView.html');
    var FieldModel = require('../models/fieldModel');
    var tr = require('../tr');

    return backbone.View.extend({
      template: underscore.template(templateText),

      render: function () {
        this.$el.html(this.template({
          fields: this.collection.toJSON(),
          FieldModel: FieldModel,
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
