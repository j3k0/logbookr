define(function (require) {

    var ProcedureEntryView = require('./views/procedureEntryView');
    var ProceduresView = require('./views/proceduresView');
    var TreePickerView = require('./views/treePickerView');
    var ProceduresCollection = require('./models/proceduresCollection');
    var ChoiceTree = require('./models/choiceTree');
    var $ = require('jquery');

    var Navigation = function(options) {

        this.updateTitle = options.updateTitle;
        this.goHome = options.goHome;

        this.openInMain = options.openInMain,
        this.mainEl = options.mainEl;

        this.openInPopover = options.openInPopover;
        this.popoverEl = options.popoverEl;
    }

    Navigation.prototype.proceduresView = function() {
        return new ProceduresView({
            collection: ProceduresCollection.getInstance(),
            updateTitle: this.updateTitle,
            openProcedure: _.bind(this.openProcedure, this),
            goBack: this.goHome
        });
    };

    Navigation.prototype.procedureView = function(procedure) {
        return new ProcedureEntryView({
            el: this.mainEl,
            collection: ProceduresCollection.getInstance(),
            model: procedure,
            updateTitle: this.updateTitle,
            openSupervision: _.bind(this.pickChoiceTreeOf, this, 'supervision'),
            openProcedure: _.bind(this.pickChoiceTreeOf, this, 'procedure'),
            openStage: _.bind(this.pickChoiceTreeOf, this, 'stage'),
            openSenior: _.bind(this.pickChoiceTreeOf, this, 'senior'),
            goBack: _.bind(this.openProcedures, this)
        });
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
        this.openInMain(this.proceduresView(), $(this.mainEl));
    };

    Navigation.prototype.mainView = Navigation.prototype.proceduresView;

    return Navigation;
});
