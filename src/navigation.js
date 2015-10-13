define(function (require) {
    var EditableView = require('./views/editableView');
    var ProcedureEntryView = require('./views/procedureEntryView');
    var ProcedureShowView = require('./views/procedureShowView');
    var ProceduresView = require('./views/proceduresView');
    var TreePickerView = require('./views/treePickerView');
    var TemplateView = require('./views/templateView');
    var template = require('./models/template');
    var ProceduresCollection = require('./models/proceduresCollection');
    var ChoiceModel = require('./models/choiceModel');
    var ChoiceTree = require('./models/choiceTree');
    var ProcedureModel = require('./models/ProcedureModel');
    var _ = require('underscore');
    var tr = require('./tr');

    var Navigation = function(options) {
        this.updateTitle = options.updateTitle;
        this.goHome = options.goHome;
        this.openInMain = options.openInMain,
        this.mainEl = options.mainEl;
        this.openInPopover = options.openInPopover;
        this.popoverEl = options.popoverEl;

        // Initialize views
        this.views = {
            procedures: new ProceduresView({
                el: this.mainEl,
                collection: ProceduresCollection.getInstance(),
                updateTitle: this.updateTitle,
                openProcedure: _.bind(this.openProcedure, this),
                openTemplate: _.bind(this.openTemplate, this),
                goBack: this.goHome
            }),

            procedure: new EditableView({
                el: this.mainEl,
                goBack: _.bind(this.openProcedures, this),
                showView: new ProcedureShowView(),
                editView: new ProcedureEntryView({
                    collection: ProceduresCollection.getInstance(),
                    updateTitle: this.updateTitle,
                    openChoiceTree: this.pickChoiceTreeOf.bind(this)
                })
            }),

            template: new TemplateView({
                el: this.mainEl,
                collection: template.getInstance(),
                updateTitle: this.updateTitle,
                goBack: _.bind(this.openProcedures, this)
            })
        }
    }

    Navigation.prototype._pickChoiceTree = function(choiceTree, cb) {
        this.openInPopover(new TreePickerView({
            el: this.popoverEl,
            items: choiceTree,
            onSelect: cb,
            openChoiceTree: _.bind(this._pickChoiceTree, this)
        }));
    };

    Navigation.prototype.pickChoiceTreeOf = function(name, cb) {
        var choice = ChoiceTree.getInstance().get(name);
        if (choice === undefined) {
            // Retrieve field's description by looking for field in:
            //  - template
            //  - current procedure optional fields
            //  - current procedure required fields
            //  - default procedure required fields
            var field = (template.getInstance().get(name) && template.getInstance().get(name).toJSON()) ||
                (this.views.procedure.model && this.views.procedure.model.fieldInfo(name)) ||
                new ProcedureModel().fieldInfo(name);

            var title = field
                ? field.description
                : tr('treePicker.defaultTitle');

            choice = new ChoiceModel({
                id: name,
                name: title,
                subtree: []
            });

            ChoiceTree.getInstance().add(choice);
            choice.save();
        }

        this._pickChoiceTree(choice.tree(), cb);
    };

    Navigation.prototype.openTemplate = function () {
        this.openInMain(this.views.template);
    };

    Navigation.prototype.openProcedure = function (procedure, isNew) {
        var mode = isNew ? EditableView.modes.EDIT : EditableView.modes.SHOW;
        this.views.procedure.swapModel(procedure, mode);
        this.openInMain(this.views.procedure);
    };

    Navigation.prototype.openProcedures = function () {
        this.openInMain(this.views.procedures);
    };

    Navigation.prototype.mainView = function () {
        return this.views.procedures;
    };

    return Navigation;
});
