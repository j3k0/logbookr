(function (root, isBrowser) {
  "use strict";

  var definition = function () {
    return {
      validationError: function (message) {
        return 'ValidationError: ' + message;
      },

      // TODO:
      // alert() is ugly!
      //
      // Simple alert() wrapper.
      display: function (message) {
        return root.alert(message);

        // TODO:
        // Validate!
        // if (!attrs.type) {
        //     if (navigator.notification && navigator.notification.alert) {
        //         navigator.notification.alert(
        //             'Veuillez sélectionner le type de l\'intervention',  // message
        //             function (){
        //             },                              // callback to invoke with index of button pressed
        //             'Sauvegarde Impossible',            // title
        //             'Fermer'                        // buttonName
        //         );
        //     }
        //     else {
        //         /*alert('Veuillez sélectionner le type de procédure');*/
        //     }
        //     return false;
        // }
      }
    };
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
