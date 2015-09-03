define(function (require) {
    var ProcedureEntryView = require('./views/procedureEntryView');
    var ProceduresView = require('./views/proceduresView');
    var TreePickerView = require('./views/treePickerView');
    var ProceduresCollection = require('./models/proceduresCollection');
    var ChoiceTree = require('./models/choiceTree');
    var Navigation = require('./navigation');

    return {
        Navigation: Navigation,
        ProcedureEntryView: ProcedureEntryView,
        ProceduresView: ProceduresView,
        TreePickerView: TreePickerView,
        ProceduresCollection: ProceduresCollection,
        ChoiceTree: ChoiceTree
    };
});
