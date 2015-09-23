define(function (require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var templateText = require("./text!./proceduresView.html");
    var ProcedureModel = require('../models/procedureModel');
    var template = require('../models/template');
    var uuid = require('../models/uuid');
    var tr = require('../tr');

    var ProceduresView = Backbone.View.extend({

        template: _.template(templateText),

        initialize: function(options) {
            this.options = options || {};
            this.options.viewName = "ProceduresView";
            this.updateTitle = options.updateTitle;
            this.openProcedure = options.openProcedure;
            this.openTemplate = options.openTemplate;
            this.goBack = options.goBack;
        },

        render: function() {
            this.$el.html(this.template({
                collection: this.collection,
                procedures: this.collection.toJSON(),
                tr: tr
            }));

            this.titleView = "Interventions";
            this.updateTitle(this.titleView);
            return this;
        },

        events:{
            'click .procedure': 'goToProcedure',
            'click .add-procedure': 'newProcedure',
            'click .edit-template': 'editTemplate'
        },

        newProcedure: function() {
            var attrs = {id: uuid()};
            var options = {template: template.getInstance().toJSON()};
            this.openProcedure(new ProcedureModel(attrs, options));
        },

        goToProcedure: function(ev) {
            ev.preventDefault();
            ev.stopPropagation();

            var chosenProcedure = $(ev.currentTarget);
            var procedureId = chosenProcedure.attr("procedure-id");
            var procedure = this.collection.get(procedureId);
            if (procedure !== undefined)
                this.openProcedure(procedure);
        },

        editTemplate: function (event) {
            event.preventDefault();
            event.stopPropagation();

            this.openTemplate();
        }
    });

    return ProceduresView;
});
