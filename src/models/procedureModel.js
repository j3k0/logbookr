define(function (require) {
    var Backbone = require('backbone');
    var ProcedureModel = Backbone.Model.extend({
        defaults: {
            type: "",
            date: "",
            patient: "",
            diagnostic: "",
            supervision: "",
            senior: "",
            stage: "",
            comment: ""
        }
    });
    return ProcedureModel;
});
