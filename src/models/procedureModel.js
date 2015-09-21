(function (root, isBrowser) {
  var definition = function (require) {
    var backbone = require('backbone');
    var FieldModel = require('./fieldModel');

    // The reason for this is that we do not want to store FieldModel isntances,
    // but we'd like some sanity check and default values.
    var toFields = function (attrsArray) {
      return attrsArray.map(function (attrs) {
        var field = new FieldModel(attrs);
        if (!field.isValid())
          throw field.validationError;

        return new FieldModel(attrs).toJSON();
      });
    };

    return backbone.Model.extend({
      defaults: function () {
        return {
          // ID and creation timestamp for sorting.
          id: '',
          createdAt: Date.now(),
          // Required fields and their values.
          date: '',
          type: '',
          patient: '',
          requiredFields: toFields([
            {name: 'date', description: 'Date performed', type: FieldModel.types.DATE},
            {name: 'type', description: 'Type of procedure', type: FieldModel.types.CHOICETREE},
            {name: 'patient', description: 'Patient\'s full name', type: FieldModel.types.TEXT}
          ]),
          // TODO:
          // rename requiredFields to fields and fields to additionalField.
          // or something
          fields: []
        };
      },

      initialize: function (attributes, options) {
        // If options.template is present, copy fields over.
        if (options && Array.isArray(options.template)) {
          this.set('fields', toFields(options.template));
        }
      }
    });
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
