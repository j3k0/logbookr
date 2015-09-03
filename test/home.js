define(function (require) {
    var Backbone = require('backbone');
    var HomeView = Backbone.View.extend({
        render: function() {
            this.$el.html('Hello!<a href="#">Logbook</a>');
            return this;
        },
        events:{
            'click a': 'openLogbook'
        },
        openLogbook: function(ev) {
            ev.preventDefault();
            Backbone.history.navigate("logbook", { trigger: true });
        }
    });
    return HomeView;
});
