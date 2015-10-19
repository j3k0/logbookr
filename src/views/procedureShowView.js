(function (root, isBrowser) {
  "use strict";

  var definition = function (require) {
    var underscore = require('underscore');
    var templateText = require('./text!./procedureShowView.html');
    var FieldView = require('./fieldView');
    var ProcedureBaseView = require('./ProcedureBaseView');
    var tr = require('../tr');

    return ProcedureBaseView.extend({
      template: underscore.template(templateText),

      render: function () {
        this.$el.html(this.template({
          requiredFields: FieldView.fieldsHtml(this.model, 'requiredFields', true),
          fields: FieldView.fieldsHtml(this.model, 'fields', true),
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
