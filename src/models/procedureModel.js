(function (root, isBrowser) {
  var definition = function (require) {
    var backbone = require('backbone');
    var TemplateModel = require('./templateModel');
    var FieldModel = require('./fieldModel');

    return backbone.Model.extend({
      defaults: function () {
        return {
          id: '',
          createdAt: Date.now(),
          requiredFields: [
            {name: 'date', description: 'Date performed', type: FieldModel.types.DATE},
            {name: 'patient', description: 'Patient\'s full name', type: FieldModel.types.TEXT},
            {name: 'procedure', description: 'Type of procedure', type: FieldModel.types.CHOICETREE}
          ].map(function (field) {
            return new FieldModel(field).toJSON();
          }),
          // TODO:
          // rename requiredFields to fields and fields to additionalField.
          // or something
          fields: []
        };
      },

      initialize: function (attributes, options) {
        // If options.template is present, copy fields over.
        if (options && options.template instanceof TemplateModel) {
          this.set('fields', options.template.get('fields').map(function (field) {
            return field.toJSON();
          }));
        }
      }
    });
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
