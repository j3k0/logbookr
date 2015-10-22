define(function (require) {
    var Backbone = require('backbone');
    var ChoiceModel = require('./choiceModel');
    var LS = require('../local-storage/index');

    var ChoiceCollection = Backbone.Collection.extend({
        localStorage: LS("ChTr"),
        model: ChoiceModel
    });

    var instance = new ChoiceCollection();
    instance.fetch();
    // ChoiceData.initialize(instance);

    ChoiceCollection.getInstance = function() {
        return instance;
    };

    return ChoiceCollection;
});
