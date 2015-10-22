(function (root, isBrowser) {
  "use strict";

  var definition = function (/*require*/) {
    return {
      "v2.Template": "diagnostic,supervision,senior,stage,comment",

      "v2.Template-diagnostic":   '{"name":"diagnostic","type":"text","description":"Diagnostic"}',
      "v2.Template-supervision":  '{"name":"supervision","type":"choicetree","description":"Supervision"}',
      "v2.Template-senior":       '{"name":"senior","type":"choicetree","description":"Senior"}',
      "v2.Template-stage":        '{"name":"stage","type":"choicetree","description":"Stage"}',
      "v2.Template-comment":      '{"name":"comment","type":"textarea","description":"Comment"}',

      "v2.Template.DescriptionToName.Diagnostic":   "diagnostic",
      "v2.Template.DescriptionToName.Supervision":  "supervision",
      "v2.Template.DescriptionToName.Senior":       "senior",
      "v2.Template.DescriptionToName.Stage":        "stage",
      "v2.Template.DescriptionToName.Comment":      "comment"
    };
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
