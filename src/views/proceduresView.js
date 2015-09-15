define(function (require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var template = require("./text!./proceduresView.html");
    var ProcedureModel = require('../models/procedureModel');
    var TemplateModel = require('../models/templateModel');
    var uuid = require('../models/uuid');

    var ProceduresView = Backbone.View.extend({

        template: _.template(template),

        initialize: function(options) {
            this.options = options || {};
            this.options.viewName = "ProceduresView";
            this.updateTitle = options.updateTitle;
            this.openProcedure = options.openProcedure;
            this.goBack = options.goBack;
        },

        render: function() {
            this.$el.html(this.template({
                collection: this.collection,
                procedures: this.collection.toJSON()
            }));

            this.titleView = "Interventions";
            this.updateTitle(this.titleView);
            return this;
        },

        events:{
            'click .procedure': 'goToProcedure',
            'click .add-procedure': 'newProcedure'
        },

        newProcedure: function() {
            var procedure = new ProcedureModel(
                {id: uuid()},
                {template: new TemplateModel()}
            );

            this.openProcedure(procedure);
        },

        goToProcedure: function(ev) {
            ev.preventDefault();
            var chosenProcedure = $(ev.currentTarget);
            var procedureId = chosenProcedure.attr("procedure-id");
            var procedure = this.collection.get(procedureId);
            if (procedure !== undefined){
                this.openProcedure(procedure);
            }
            return false;
        }
    });

    return ProceduresView;
});
