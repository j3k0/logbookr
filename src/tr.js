(function (root, isBrowser) {
  "use strict";

  var definition = function () {
    // tr() for translations, pass in UI string key (and, optionally, something more),
    // get translated string for UI.
    // Something for the future, if it will be needed.
    //
    // For now let's pass in english strings, and in case we are in production,
    // turn them into french ones. It would be better to pass in string keys, though,
    // (and nesting and stuff... Not needed for now, app is small, so whatever).

    var locales = {
      'fr': {
        '_test': 'fr test string'
      },

      'en': {
        '_test': 'test string',

        // FieldModel types
        'FieldModel.DATE': 'Date',
        'FieldModel.TEXT': 'Text',
        'FieldModel.TEXTAREA': 'Text Area',
        'FieldModel.CHOICETREE': 'Choice Tree',

        // proceduresView
        'procedures.edit-template': 'Edit Template',

        // templateView
        'template.add-new-field': 'Add new field',
        'template.save-field': 'Save Changes',
        'template.remove-field': 'Remove Field',
        'tempalte.description-placehodler': 'Type in field\'s description…'
      }
    };

    var errorMessage = function (type, key) {
      return '[' + type + '] ' + tr.locale + ' -> ' + key
    };

    var tr = function (key) {
      if (!locales.hasOwnProperty(tr.locale))
        return errorMessage('No Locale', key);

      if (!locales[tr.locale].hasOwnProperty(key))
        return errorMessage('No Translation', key);

      return locales[tr.locale][key];
    };

    tr.locale = 'en';
    return tr;
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
