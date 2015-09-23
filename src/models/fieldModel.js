(function (root, isBrowser) {
  "use strict";

  var definition = function (require) {
    var Backbone = require('backbone');
    var errors = require('../errors');

    var types = ['date', 'text', 'textarea', 'choicetree'];

    var FieldModel = Backbone.Model.extend({
      idAttribute: 'name',

      defaults: function () {
        return {
          name: '',
          type: FieldModel.types.TEXT,
          description: ''
        };
      },

      validate: function (attrs) {
        // type must be one of `FieldModel.types`.
        if (-1 === types.indexOf(attrs.type)) {
          return errors.validationError('`type` must be one of `'
            + JSON.stringify(types) + '`; got `' + attrs.type + '`.');
        }
      }
    },

    {
      // Attach class property `types` so we can accesss FieldModel.DATE, etc…
      types: types.reduce(function (prev, type) {
        prev[type.toUpperCase()] = type;
        return prev;
      }, {})
    });

    return FieldModel;
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
