(function (root, isBrowser) {
  "use strict";

  var definition = function (require) {
    var _ = require('underscore');
    var backbone = require('backbone');
    var templateText = require('./text!./fieldView.html');
    var FieldModel = require('../models/FieldModel');
    var tr = require('../tr');

    var FieldView = backbone.View.extend({
      template: _.template(templateText),

      initialize: function (options) {
        this.options = options || {};
        this.options.viewName = 'FieldView';

        this.value = options.value || '';
        this.readonly = options.readonly;
      },

      html: function () {
        return this.template({
          field: this.model.toJSON(),
          value: this.value,
          FieldModel: FieldModel,
          tr: tr,
          readonly: this.readonly
        });
      }
    },

    {
      fieldHtml: function (readonly, field) {
        var view = new FieldView({
          model: new FieldModel(field),
          value: this.get(field.name),
          tr: tr,
          readonly: readonly
        });

        return view.html();
      },

      fieldsHtml: function (model, key, readonly) {
        return model.get(key)
          .map(FieldView.fieldHtml.bind(model, readonly))
          .join('\n');
      }
    });

    return FieldView;
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
