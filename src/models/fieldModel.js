(function (root, isBrowser) {
  "use strict";

  var definition = function (require) {
    var Backbone = require('backbone');
    var types = ['date', 'text', 'textarea', 'choicetree'];

    return Backbone.Model.extend({
      defaults: function () {
        return {
          name: '',
          type: '',
          description: ''
        };
      },

      validate: function (attrs) {
        // type must be one of `FieldModel.types`.
        if (-1 === types.indexOf(attrs.type)) {
          return 'InvalidAttribute: `type` must be one of `'
            + JSON.stringify(types) + '`; got `' + attrs.type + '`.'
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
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));