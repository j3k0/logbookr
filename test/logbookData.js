define(function (require) {

    var ChoiceModel = require('logbookr/models/choiceModel');
    var uuid = require('logbookr/models/uuid');

    var procedure = function() {
        return new ChoiceModel({
            id: "type",
            name: "Procédure",
            subtree: [{
                id: uuid(),
                name: "Rachis",
                subtree: [{
                    id: uuid(),
                    name: "Cervical",
                    subtree: [{
                        id: uuid(),
                        name: "Arthrodèse antérieure"
                    }, {
                        id: uuid(),
                        name: "Laminectomie cervicale"
                    }, {
                        id: uuid(),
                        name: "Instrumentation postérieure"
                    }]
                }, {
                    id: uuid(),
                    name: "Thoraco-lombaire",
                    subtree: [{
                        id: uuid(),
                        name: "Arthrodèse postérieure"
                    }, {
                        id: uuid(),
                        name: "Arthrodèse antérieure"
                    }, {
                        id: uuid(),
                        name: "Arthrodèse circonférentielle"
                    }, {
                        id: uuid(),
                        name: "Laminectomie lombaire"
                    }, {
                        id: uuid(),
                        name: "Discectomie simple"
                    }]
                }]
            }]
        });
    };

    var senior = function() {
        return new ChoiceModel({
            id: "senior",
            name: "Senior",
            subtree: []
        });
    };

    var supervision = function() {
        return new ChoiceModel({
            id: "supervision",
            name: "Supervision",
            subtree: [{
                id: uuid(),
                name: "Seul"
            },
            {
                id: uuid(),
                name: "Aidé"
            },{
                id: uuid(),
                name: "Observateur"
            }]
        });
    };

    var stage = function() {
        return new ChoiceModel({
            id: "stage",
            name: "Stage",
            subtree: []
        });
    };

    var ChoiceData = {
        initialize: function(instance) {
            if (!instance.get("procedure")) {
                instance.add(procedure());
            }
            if (!instance.get("senior")) {
                instance.add(senior());
            }
            if (!instance.get("stage")) {
                instance.add(stage());
            }
            if (!instance.get("supervision")) {
                instance.add(supervision());
            }
        }
    };

    return {
        choices: ChoiceData
    };
});

