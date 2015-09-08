define(function (require) {

    var Backbone = require('backbone');
    var BackboneLS = require('backbone.localstorage');
    var uuid = require('./uuid');
    var ChoiceModel = require('./choiceModel');
    // var ChoiceData = require('./choiceData');

    var ChoiceCollection = Backbone.Collection.extend({
        localStorage: new Backbone.LocalStorage("ChTr"), // Unique name within your app.
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
