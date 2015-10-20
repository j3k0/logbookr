(function (root, isBrowser) {
  "use strict";

  var definition = function (require) {
    var moment = require('moment');
    var config = require('./config');
    var ProcedureModel = require('../models/ProcedureModel');

    var startsWith = function (str, beginning) {
      return 0 === str.indexOf(beginning);
    };

    var dateFromStr = function (str) {
      return moment(str, 'DD-MM-YYYY HH:mm').valueOf();
    };

    return {
      startsWith: startsWith,

      shouldConvert: function (key) {
        return !key.startsWith(config.dataPrefix);
      },

      convert: function (key, item) {
        var convertedItem = null;

        if (-1 !== ['ChTr', 'Procs'].indexOf(key))
          convertedItem = item;
        else if (startsWith(key, 'ChTr-'))
          convertedItem = item;
        else if (startsWith(key, 'Procs-')) {
          var parsed = JSON.parse(item);
          var photos = parsed.picture
            ? [{url: parsed.picture, legend: ''}]
            : [];

          convertedItem = JSON.stringify(new ProcedureModel({
            // meta
            id: parsed.id,
            createdAt: dateFromStr(parsed.date),
            // required fields
            date: parsed.date,
            type: parsed.type,
            patient: parsed.patient,
            photos: photos,
            // requiredFields: toFieldsJson(toFields([
            //   {name: 'date', description: tr('FieldModel.required.date'), type: FieldModel.types.DATE},
            //   {name: 'type', description: tr('FieldModel.required.type'), type: FieldModel.types.CHOICETREE},
            //   {name: 'patient', description: tr('FieldModel.required.patient'), type: FieldModel.types.TEXT},
            //   {name: 'photos', description: tr('FieldModel.required.photos'), type: FieldModel.types.PHOTOS}
            // ])),
            diagnostic: parsed.diagnostic || '',
            supervision: parsed.supervision || '',
            senior: parsed.senior || '',
            stage: parsed.stage || '',
            comment: parsed.comment || '',
            fields: [
              {name: 'diagnostic', description: 'Diagnostic', type: 'text'},
              {name: 'supervision', description: 'Supervision', type: 'choicetree'},
              {name: 'senior', description: 'Senior', type: 'choicetree'},
              {name: 'stage', description: 'Stage', type: 'choicetree'},
              {name: 'comment', description: 'Comment', type: 'textarea'}
            ]
          }).toJSON());
        }

        return {
          key: config.dataPrefix + key,
          item: convertedItem,
          safekeepKey: config.safekeepPrefix + key,
          safekeepItem: item
        }
      }
    }
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));
