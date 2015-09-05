define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  var Backbone = require("backbone");
  var $ = require('jquery');
  var HomeView = require("./home");
  var LogbookR = require('logbookr/index');
  var LogbookData = require('./logbookData');

  // Defining the application router.
  module.exports = Backbone.Router.extend({

    initialize: function(options) {
        // Load logbook initial data
        LogbookData.choices.initialize(LogbookR.ChoiceTree.getInstance());
        $("#back").on("click", _.bind(function () { this.view.goBack(); }, this));
    },

    routes: {
      "": "home",
      "home": "home",
      "logbook": "logbook"
    },

    home: function() {
      this.openInMain(new HomeView(), $("#tab-content"));
    },

    logbook: function() {
        this.openInMain(new LogbookR.Navigation({
            goHome: _.bind(Backbone.history.navigate, Backbone.history, "home", { trigger: true }),
            updateTitle: _.bind(this.updateTitle, this),
            openInMain: _.bind(this.openInMain, this),
            mainEl: "#tab-content",
            openInPopover: _.bind(this.openInPopover, this),
            popoverEl: "#popover"
        }).mainView(), $("#tab-content"));
    },

    openInMain: function(view, $el) {
        this.mainView = this.view = view.render();
        if ($el)
            $el.html(this.mainView.$el);
        // $("#main").html(this.mainView.$el);
    },
    openInPopover: function(view) {
        if (this.popoverView) {
            this.popoverView.undelegateEvents();
        }
        view.render().$el.show();
        this.popoverView = this.view = view;
    },
    updateTitle: function(text) {
        $("#title").html(text);
    }
  });
});
