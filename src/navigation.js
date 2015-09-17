define(function (require) {

    var ProcedureEntryView = require('./views/procedureEntryView');
    var ProceduresView = require('./views/proceduresView');
    var TreePickerView = require('./views/treePickerView');
    var ProceduresCollection = require('./models/proceduresCollection');
    var ChoiceTree = require('./models/choiceTree');
    var $ = require('jquery');
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
            openSupervision: _.bind(this.pickChoiceTreeOf, this, 'supervision'),
            openProcedure: _.bind(this.pickChoiceTreeOf, this, 'procedure'),
            openStage: _.bind(this.pickChoiceTreeOf, this, 'stage'),
            openSenior: _.bind(this.pickChoiceTreeOf, this, 'senior'),
            goBack: _.bind(this.openProcedures, this)
        });

        this.loadedViews.procedureView.swapModel(procedure);
        return this.loadedViews.procedureView;
    };

    Navigation.prototype.pickChoiceTree = function(choiceTree, cb) {
        this.openInPopover(new TreePickerView({
            el: this.popoverEl,
            items: choiceTree,
            onSelect: cb,
            openChoiceTree: _.bind(this.pickChoiceTree, this)
        }));
    };

    Navigation.prototype.pickChoiceTreeOf = function(name, cb) {
        this.pickChoiceTree(ChoiceTree.getInstance().get(name).tree(), cb);
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
