define(function (require) {

    var Backbone = require('backbone');
    var ProcedureModel = require('./procedureModel');
    require('backbone.localstorage');

    var ProceduresCollection = Backbone.Collection.extend({
        localStorage: new Backbone.LocalStorage("Procs"), // Unique name within your app.
        model: ProcedureModel,

        // Most recent on top.
        comparator: function (model) {
            return -model.get('createdAt');
        },

        // Returns array of models that have patient's name similar to
        // @query string.
        filterByPatient: function (query) {
            var qs = String(query).toLowerCase();

            return this.filter(function (model) {
                return -1 !== model.get('patient').toLowerCase().indexOf(qs);
            });
        }
    });

    var instance = new ProceduresCollection();
    instance.fetch();

    ProceduresCollection.getInstance = function() {
        return instance;
    };

    return ProceduresCollection;
});
