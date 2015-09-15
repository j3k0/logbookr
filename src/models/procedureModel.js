(function (root, isBrowser) {
  var definition = function (require) {
    var backbone = require('backbone');
    var TemplateModel = require('./templateModel');
    var FieldModel = require('./fieldModel');

    return backbone.Model.extend({
      defaults: function () {
        return {
          id: '',
          date: '',
          patient: '',
          procedure: '',
          fields: []
        };
      },

      initialize: function (attributes, options) {
        var fields = this.get('fields');

        if (options && options.template instanceof TemplateModel) {
          // We've been passed a template which means we are creating new procedure.
          // Copy over template fields so we can save them later.
          fields = options.template.get('fields').slice();
        }
        else {
          // We could also be creating model from existing JSON, in this case
          // we will need to transform existing fields array's elements
          // into FieldModel instances.
          fields = fields.map(function (attrs) {
            return new FieldModel(attrs);
          });
        }

        this.set('fields', fields);
      }
    });
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
