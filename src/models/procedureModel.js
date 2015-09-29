(function (root, isBrowser) {
  var definition = function (require) {
    var backbone = require('backbone');
    var FieldModel = require('./fieldModel');
    var errors = require('../errors');
    var tr = require('../tr');

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
          photos: [],
          requiredFields: toFields([
            {name: 'date', description: tr('FieldModel.required.date'), type: FieldModel.types.DATE},
            {name: 'type', description: tr('FieldModel.required.type'), type: FieldModel.types.CHOICETREE},
            {name: 'patient', description: tr('FieldModel.required.patient'), type: FieldModel.types.TEXT},
            {name: 'photos', description: tr('FieldModel.required.photos'), type: FieldModel.types.PHOTOS}
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
          var fields = toFields(options.template);
          this.set('fields', fields);

          fields.forEach(function (field) {
            this.set(field.name, '');
          }, this);
        }
      },

      validate: function () {
        // First of all, all the requiredFields and meta fields
        // must be set as attributes. They can not be empty strings.
        var expectedAttributes = this.get('requiredFields')
          .map(function (field) {return field.name;})
          .concat('id', 'createdAt')
          .every(function (attributeName) {
            // Since we only deal with strings, we can just cast value to Boolean.
            // Values like 0 won't work, though.
            return !!this.get(attributeName);
          }, this);

        if (!expectedAttributes)
          return errors.validationError('Required attributes missing.');
      },

      // Returns difference between current model state and the state before
      // previous `set()`. Effectively, set of attribute changes
      // that will return model into its previous state, if applied.
      diff: function () {
        return this.changedAttributes(this.previousAttributes());
      },

      // Sets model to its previous state (before last `set()` call).
      revert: function () {
        var diff = this.diff();
        if (diff)
          this.set(diff);
      },

      // Calls `set()` with `changes`. If resulting model is valid,
      // returns true. Otherwise, cancels changes and returns false.
      safeSet: function (changes) {
        var hasChanges = changes && ('object' === typeof changes) && (Object.keys(changes).length > 0)
        if (!hasChanges)
          throw new Error('InvalidChanges');

        this.set(changes);
        if (this.isValid())
          return true;

        this.revert();
        return false;
      },

      // Returns field info by its name.
      fieldInfo: function (fieldName) {
        var fieldInfo = undefined;

        var found = this.get('requiredFields')
          .concat(this.get('fields'))
          .some(function (field) {
            if (field.name === fieldName) {
              fieldInfo = field;
              return true;
            }
            return false;
          }, this);

        return found ? fieldInfo : undefined;
      }
    });
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
