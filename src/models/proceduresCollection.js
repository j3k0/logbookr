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
    /* instance.add([
        new ProcedureModel({
            id: '1',
            type: 'Herniectomie',
            date: '1-1-2015',
            patient: 'Michel Sapin',
            diagnostic: 'Mal au dos',
            supervision: 'seul',
            senior: 'oui',
            stage: 'non',
            comment: 'ca s est bien passe'
        })
    ]); */

    ProceduresCollection.getInstance = function() {
        return instance;
    };

    return ProceduresCollection;
});
