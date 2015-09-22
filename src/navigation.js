define(function (require) {

    var ProcedureEntryView = require('./views/procedureEntryView');
    var ProceduresView = require('./views/proceduresView');
    var TreePickerView = require('./views/treePickerView');
    var TemplateView = require('./views/templateView');
    var template = require('./models/template');
    var ProceduresCollection = require('./models/proceduresCollection');
    var ChoiceModel = require('./models/choiceModel');
    var ChoiceTree = require('./models/choiceTree');
    var _ = require('underscore');

    var Navigation = function(options) {

        this.updateTitle = options.updateTitle;
        this.goHome = options.goHome;

        this.openInMain = options.openInMain,
        this.mainEl = options.mainEl;

        this.openInPopover = options.openInPopover;
        this.popoverEl = options.popoverEl;
    }

    Navigation.prototype.proceduresView = function() {
        this.loadedViews = this.loadedViews || {};
        this.loadedViews.proceduresView = this.loadedViews.proceduresView || new ProceduresView({
            el: this.mainEl,
            collection: ProceduresCollection.getInstance(),
            updateTitle: this.updateTitle,
            openProcedure: _.bind(this.openProcedure, this),
            openTemplate: _.bind(this.openTemplate, this),
            goBack: this.goHome
        });

        return this.loadedViews.proceduresView;
    };

    Navigation.prototype.procedureView = function(procedure) {
        this.loadedViews = this.loadedViews || {};
        this.loadedViews.procedureView = this.loadedViews.procedureView || new ProcedureEntryView({
            el: this.mainEl,
            collection: ProceduresCollection.getInstance(),
            updateTitle: this.updateTitle,
            openChoiceTree: this.pickChoiceTreeOf.bind(this),
            goBack: _.bind(this.openProcedures, this)
        });

        this.loadedViews.procedureView.swapModel(procedure);
        return this.loadedViews.procedureView;
    };

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
            choice = new ChoiceModel({
                id: name,
                name: 'Custom Tree??',
                subtree: []
            });

            ChoiceTree.getInstance().add(choice);
            choice.save();
        }

        this._pickChoiceTree(choice.tree(), cb);
    };

    Navigation.prototype.openTemplate = function () {
        this.loadedViews = this.loadedViews || {};
        this.loadedViews.templateView = this.loadedViews.templateView || new TemplateView({
            el: this.mainEl,
            collection: template.getInstance(),
            updateTitle: this.updateTitle,
            goBack: _.bind(this.openProcedures, this)
        });

        this.openInMain(this.loadedViews.templateView);
    };

    Navigation.prototype.openProcedure = function(procedure) {
        this.openInMain(this.procedureView(procedure));
    };

    Navigation.prototype.openProcedures = function() {
        this.openInMain(this.proceduresView());
    };

    Navigation.prototype.mainView = Navigation.prototype.proceduresView;

    return Navigation;
});
