(function (root, isBrowser) {
  var definition = function (require) {
    var Backbone = require('backbone');
    var FieldModel = require('./fieldModel');
    var uuid = require('./uuid');

    return Backbone.Model.extend({
      defaults: function () {
        return {
          id: uuid(),
          date: new Date(),
          patient: '',
          procedure: ''
        };
      },

      initialize: function () {
        // Copy over fields from template.
        //
        // TODO:
        // For now it is faked with some predefined fields, and random values.
        var fields = [
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
        });

        // Do we need backbone.Collection here? Just array will do.
        this.set('fields', fields);
      }
    });
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
