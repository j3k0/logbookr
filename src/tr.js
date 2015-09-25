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
        '_test': 'fr test string',

        // proceduresView
        'procedures.title': 'Interventions',
        'procedures.add-procedure': '+ Ajouter une intervention',

        // procedureView
        'procedure.title': 'Nouvelle intervention',
        'procedure.save-button': 'Sauvegarder',
        'procedure.delete-button': 'Supprimer'
      },

      'en': {
        '_test': 'test string',

        // FieldModel types
        'FieldModel.DATE': 'Date',
        'FieldModel.TEXT': 'Text',
        'FieldModel.TEXTAREA': 'Text Area',
        'FieldModel.CHOICETREE': 'Choice Tree',

        // FieldModel required fields descriptions
        'FieldModel.required.date': 'Date Performed',
        'FieldModel.required.type': 'Type of Procedure',
        'FieldModel.required.patient': 'Patient\'s Full Name',

        // proceduresView
        'procedures.title': 'The Interventions',
        'procedures.add-procedure': '+ Add new Procedure',
        'procedures.edit-template': 'Edit Template',

        // procedureView
        'procedure.title': 'New Intervention',
        'procedure.save-button': 'Save Procedure',
        'procedure.delete-button': 'Delete Procedure',

        // templateView
        'template.title': 'Template Editor',
        'template.add-new-field': 'Add new field',
        'template.remove-field': 'Remove Field',
        'tempalte.description-placehodler': 'Type in field\'s description…',

        // treePickerView
        'treePicker.defaultTitle': 'Custom Choice Tree'
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
