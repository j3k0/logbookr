(function (root, isBrowser) {
  "use strict";

  // Template is just an array of fields.
  var definition = function (require) {
    var backbone = require('backbone');
    var FieldModel = require('./fieldModel');

    return backbone.Model.extend({
      defaults: {
        id: 'procedureTemplate',

        // TODO:
        // This should be [] by default and fetched in an actual app.
        fields: [
          'type',
          'diagnostic',
          'supervision',
          'senior',
          'stage',
          'comment'
        ].map(function (name) {
          return new FieldModel({
            name: name,
            type: FieldModel.types.TEXT,
            description: 'Hardcoded `' + name + '` field description.'
          });
        })
      }
    });
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
