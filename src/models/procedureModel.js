(function (root, isBrowser) {
  var definition = function (require) {
    var Backbone = require('backbone');
    var FieldModel = require('./fieldModel');
    var FieldsCollection = require('./fieldsCollection');
    var uuid = require('./uuid');

    return Backbone.Model.extend({
      defaults: function () {
        return {
          id: uuid(),
          name: '',
          procedure: '',
          date: new Date()
        };
      },

      initialize: function () {
        // Copy over template.
        //
        // TODO:
        // For now it is faked with some predefined fields, and random values.
        var self = this;
        var fields = [ 'type',
          'patient',
          'diagnostic',
          'supervision',
          'senior',
          'stage',
          'comment'
        ].map(function (name) {
          if (!self.has(name))
            self.set(name, 'Hardcoded `' + name + '` value');

          return new FieldModel({
            name: name,
            type: FieldModel.types.TEXT,
            description: 'Hardcoded `' + name + '` field.'
          });
        });

        var collection = new FieldsCollection(fields);
        self.set('fields', collection);
      }
    });
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
