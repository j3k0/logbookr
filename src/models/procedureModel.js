(function (root, isBrowser) {
  var definition = function (require) {
    var backbone = require('backbone');
    var moment = require('moment');
    var TemplateModel = require('./templateModel');
    var uuid = require('./uuid');

    return backbone.Model.extend({
      defaults: function () {
        return {
          id: uuid(),
          date: moment().format('DD-MM-YYYY HH:MM'),
          patient: '',
          procedure: ''
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
