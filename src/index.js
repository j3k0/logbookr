define(function (require) {
    var ProcedureEditView = require('./views/procedureEditView');
    var ProceduresView = require('./views/proceduresView');
    var TreePickerView = require('./views/treePickerView');
    var ProceduresCollection = require('./models/proceduresCollection');
    var ChoiceTree = require('./models/choiceTree');
    var Navigation = require('./navigation');

    return {
        Navigation: Navigation,
        ProcedureEditView: ProcedureEditView,
        ProceduresView: ProceduresView,
        TreePickerView: TreePickerView,
        ProceduresCollection: ProceduresCollection,
        ChoiceTree: ChoiceTree
    };
});
