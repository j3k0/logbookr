(function (root, isBrowser) {
  var definition = function (require) {
    var backbone = require('backbone');
    var TemplateModel = require('./templateModel');

    return backbone.Model.extend({
      defaults: function () {
        return {
          id: '',
          createdAt: Date.now(),
          date: '',
          patient: '',
          procedure: '',
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
