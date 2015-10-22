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

        // camera errors
        'camera.no-camera': 'Aucun appareil photo détecté.',
        'camera.no-access-to-assets': 'Si l\'appareil photo ne fonctionne pas, veuillez aller dans les "Réglages" de votre iPhone/iPad, section "Confidentialité", "Appareil photo" et autoriser AJCR à utiliser l\'appareil.'
      },

      'en': {
        '_test': 'test string',

        // FieldModel types
        'FieldModel.DATE': 'Date',
        'FieldModel.TEXT': 'Text',
        'FieldModel.TEXTAREA': 'Text Area',
        'FieldModel.CHOICETREE': 'Choice Tree',
        'FieldModel.PHOTOS': 'Photos',

        // FieldModel required fields descriptions
        'FieldModel.required.date': 'Date Performed',
        'FieldModel.required.type': 'Type of Procedure',
        'FieldModel.required.patient': 'Patient\'s Full Name',
        'FieldModel.required.photos': 'Photos',

        // editableView
        'editable.edit': 'Edit',
        'editable.remove': 'Remove',
        'editable.save': 'Save Changes',
        'editable.discard': 'Discard Changes',

        // proceduresView
        'procedures.title': 'The Interventions',
        'procedures.add-procedure': '+ Add new Procedure',
        'procedures.edit-template': 'Edit Template',
        'procedures.filter-by-patient.title': 'Filter by Patient\'s name',
        'procedures.filter-by-patient.placeholder': 'Type in patient\'s name…',
        'procedures.noting-found': 'Nothing found',

        // procedureView
        'procedure.title': 'New Intervention',

        // fieldView
        'field.delete-photo': 'Delete Photo',
        'field.no-photos': 'No photos yet',

        // templateView
        'template.title': 'Template Editor',
        'template.add-new-field': 'Add new field',
        'template.remove-field': 'Remove Field',
        'template.description-placehodler': 'Type in field\'s description…',
        'template.description-missing-placehodler': 'No description specified',
        'template.no-fields': 'No additional fields yet',

        // treePickerView
        'treePicker.defaultTitle': 'Custom Choice Tree',

        // alerts
        'alert.default.title': 'Please Confirm',
        'alert.default.text': 'Please confirm the action.',
        'alert.default.confirm': 'Confirm',
        'alert.default.cancel': 'Cancel',

        'alert.default.error.title': 'Error',
        'alert.default.error.text': 'Error occured.',
        'alert.default.error.details': 'Details:',

        'alert.error.ValidationError.title': 'Validation Failed',
        'alert.error.ValidationError.text': 'Input data is wrong.',

        'alert.error.DuplicateError.title': 'Duplicates Detected',
        'alert.error.DuplicateError.text': 'Data must be unique.',

        'alert.errro.CameraError.title': 'Camera Error',
        'alert.errro.CameraError.text': 'Could not take photo',

        'alert.removeProcedure.title': 'Removing Procedure',
        'alert.removeProcedure.text': 'Are you sure you want to remove this procedure?',
        'alert.removeProcedure.confirm': 'Remove',

        'alert.removeTemplate.title': 'Removing Template',
        'alert.removeTemplate.text': 'All template fields will be removed.',
        'alert.removeTemplate.confirm': 'Remove',

        'alert.removeField.title': 'Removing Field',
        'alert.removeField.text': 'Are you sure you want to remove this field?',
        'alert.removeField.confirm': 'Remove',

        'alert.removePhoto.title': 'Removing Photo',
        'alert.removePhoto.text': 'Are you sure you want to remove this photo?',
        'alert.removePhoto.confirm': 'Remove',

        'alert.unsavedChanges.title': 'Unsaved Changes',
        'alert.unsavedChanges.text': 'You have made some changes, but have not saved them.',
        'alert.unsavedChanges.confirm': 'Discard and Proceed',

        // camera errors
        'camera.no-camera': 'Camera not found.',
        'camera.no-access-to-assets': 'If the camera does not work, please go to the "Settings" on your iPhone / iPad, section "Privacy", "Camera" and allow AJCR to access your device\'s camera.'
      }
    };

    var errorMessage = function (type, key) {
      return '[' + type + '] ' + tr.locale + ' -> ' + key
    };

    var tr = function (key) {
      if (!locales.hasOwnProperty(tr.locale))
        return errorMessage('No Locale', key);

      if (!tr.has(key))
        return errorMessage('No Translation', key);

      return locales[tr.locale][key];
    };

    tr.has = function (key) {
        return locales[tr.locale].hasOwnProperty(key);
    };

    tr.locale = 'en';
    return tr;
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
