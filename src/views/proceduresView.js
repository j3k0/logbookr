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

            this._filteredBy = null;
            this._filterByPatientDebounced = _.debounce(this._filterByPatient.bind(this), 150);
        },

        render: function() {
            this.$el.html(this.template({
                procedures: this.collection.toJSON(),
                tr: tr
            }));

            this.$procedures = this.$('.procedure');
            this.$nothingFound = this.$('.js-nothing-found');
            this.titleView = tr('procedures.title');
            this.updateTitle(this.titleView);
            return this;
        },

        events: {
            'click .procedure': 'goToProcedure',
            'click .add-procedure': 'newProcedure',
            'click .edit-template': 'editTemplate',
            'keyup .js-filter-by-patient': 'filterByPatient'
        },

        newProcedure: function() {
            var attrs = {id: uuid()};
            var options = {template: template.getInstance().toJSON()};
            this.openProcedure(new ProcedureModel(attrs, options), true);
        },

        goToProcedure: function(ev) {
            ev.preventDefault();
            ev.stopPropagation();

            var chosenProcedure = this.$(ev.currentTarget);
            var procedureId = chosenProcedure.data("procedure-id");
            var procedure = this.collection.get(procedureId);
            if (procedure !== undefined)
                this.openProcedure(procedure);
        },

        editTemplate: function (event) {
            event.preventDefault();
            event.stopPropagation();

            this.openTemplate();
        },

        filterByPatient: function (event) {
            this._filterByPatientDebounced(event);
        },

        _filterByPatient: function (event) {
            event.preventDefault();
            event.stopPropagation();
            console.log('called', Date.now());

            var $input = $(event.target)
            var query = $input.val();

            // Empty input means "show everything".
            if (query === '')
                query = null;

            // We are done, if already filtered with same query.
            if (this._filteredBy === query)
                return;

            // Remember current state.
            this._filteredBy = query;

            if (query === null) {
                this.$nothingFound.hide();
                this.$procedures.show();
                return;
            }

            // Find matching ids.
            var ids = this.collection.filterByPatient(query).map(function (m) {
                return m.id;
            });

            // Hide everything, but ids.
            var idsSelector = '[data-procedure-id="' + ids.join('|') + '"]';
            var nShown = this.$procedures.hide().filter(idsSelector).show().length;

            if (nShown === 0)
                this.$nothingFound.show();
            else
                this.$nothingFound.hide();
        }
    });

    return ProceduresView;
});
