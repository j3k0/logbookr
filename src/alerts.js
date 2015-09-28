(function (root, isBrowser) {
  "use strict";

  var definition = function (require) {
    var swal = require('sweetalert');
    var debug = require('./debug');
    var tr = require('./tr');

    // Translating alerts with default values. These are the same:
    //  getTr('removeProcedure', 'title')
    //  tr('alert.removeProcedure.title')
    //
    // Except if that translation is missing, it will return:
    //  tr('alert.default.title')
    var getTr = function (alertId, subkey, defaultPrefix) {
      var key = 'alert.' + alertId + '.' + subkey;
      var defaultKey = 'alert.default.' + (defaultPrefix
        ? defaultPrefix + '.' + subkey
        : subkey);

      if (tr.has(key))
        return tr(key);

      debug.warn('subkey `' + subkey + '` not found for alert `' + alertId + '`;',
                 'using default one: `' + defaultKey + '`.');
      return tr(defaultKey);
    };

    return {
      // Asks user to confirm something, calls calback with boolean:
      // callback(confirmed)
      //
      // Translation subkeys: title, text, confirm, cancel
      confirm: function (alertId, callback) {
        return swal({
          type: 'warning',
          title: getTr(alertId, 'title'),
          text: getTr(alertId, 'text'),
          confirmButtonText: getTr(alertId, 'confirm'),
          cancelButtonText: getTr(alertId, 'cancel'),
          showConfirmButton: true,
          showCancelButton: true
        }, callback);
      }
    };
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
