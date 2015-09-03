define(function (require) {

    var Backbone = require('backbone');
    var BackboneLS = require('backbone.localStorage');
    var ProcedureModel = require('./procedureModel');

    var ProceduresCollection = Backbone.Collection.extend({
        localStorage: new Backbone.LocalStorage("Procs"), // Unique name within your app.
        model: ProcedureModel
    });

    var instance = new ProceduresCollection();
    instance.fetch();

    ProceduresCollection.getInstance = function() {
        return instance;
    };

    return ProceduresCollection;
});
