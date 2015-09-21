(function (root, isBrowser) {
  "use strict";

  var definition = function (require) {
    var backbone = require('backbone');
    var Field = require('./fieldModel');
    require('backbone.localstorage');

    var template = backbone.Collection.extend({
      model: Field,
      localStorage: new backbone.LocalStorage('Template')

      // TODO:
      // possibly add a comparator, so fields won't appear in a random order.
    });

    var instance = new template();
    instance.fetch();

    template.getInstance = function () {
        return instance;
    };

    return template;
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
