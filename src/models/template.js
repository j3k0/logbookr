(function (root, isBrowser) {
  "use strict";

  var definition = function (require) {
    var backbone = require('backbone');
    var Field = require('./fieldModel');
    require('backbone.localstorage');

    var localStorageId = function (postfix) {
      var base = 'Template';
      return postfix
        ? base + '.' + postfix
        : base;
    };

    var localStorageIdDescriptionToName = function (description) {
      return localStorageId('DescriptionToName.' + description)
    };

    var template = backbone.Collection.extend({
      model: Field,
      localStorage: new backbone.LocalStorage(localStorageId()),

      // TODO:
      // possibly add a comparator, so fields won't appear in a random order.

      // Provides mapping between field's description and name.
      // Allows "restoring" fields.
      // See #7 for more details.
      descriptionToName: function (description) {
        var key = localStorageIdDescriptionToName(description);
        var stored = root.localStorage.getItem(key);
        return stored === null
          ? undefined
          : stored;
      },

      setDescriptionToName: function (description, name) {
        var key = localStorageIdDescriptionToName(description);
        root.localStorage.setItem(key, name);
      }
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
