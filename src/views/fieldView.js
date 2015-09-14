(function (root, isBrowser) {
  "use strict";

  var definition = function (require) {
    var _ = require('underscore');
    var backbone = require('backbone');
    var templateText = require('./text!./fieldView.html');

    return backbone.View.extend({
      template: _.template(templateText),

      initialize: function (options) {
        this.options = options || {};
        this.options.viewName = 'FieldView';

        this.value = options.value || '';
      },

      html: function () {
        return this.template({
          field: this.model.toJSON(),
          value: this.value
        });
      }

      // TODO:
      // Not really needed. Maybe later…
      //
      // render: function () {
      //   this.$el.html(this.html());
      //   return this;
      // }
    });
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
