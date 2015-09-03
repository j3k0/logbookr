define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  var Backbone = require("backbone");
  var $ = require('jquery');
  var HomeView = require("./home");
  var LogbookR = require('logbookr/index');

  // Defining the application router.
  module.exports = Backbone.Router.extend({
    routes: {
      "": "home",
      "home": "home",
      "logbook": "logbook"
    },

    home: function() {
      this.openInMain(new HomeView(), $("#main"));
    },

    logbook: function() {
        this.openInMain(new LogbookR.Navigation({
            goHome: _.bind(Backbone.history.navigate, Backbone.history, "home"),
            updateTitle: _.bind(this.updateTitle, this),
            openInMain: _.bind(this.openInMain, this),
            mainEl: "#main",
            openInPopover: _.bind(this.openInPopover, this),
            popoverEl: "#popover"
        }).mainView(), $("#main"));
    },

    openInMain: function(view, $el) {
        this.mainView = view.render();
        if ($el)
            $el.html(this.mainView.$el);
        // $("#main").html(this.mainView.$el);
    },
    openInPopover: function(view) {
        if (this.popoverView) {
            this.popoverView.undelegateEvents();
        }
        view.render().$el.show();
        this.popoverView = view;
    },
    updateTitle: function(text) {
        $("#title").html(text);
    }
  });
});
