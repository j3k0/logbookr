(function (root, isBrowser) {
  var definition = function (require) {
    var backbone = require('backbone');
    var TemplateModel = require('./templateModel');

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
        var hasTemplate = options && options.template instanceof TemplateModel;
        var fields = hasTemplate ? options.template.get('fields').slice() : [];
        this.set('fields', fields);
      }
    });
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
