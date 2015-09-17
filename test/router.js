define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  var Backbone = require("backbone");
  var $ = require('jquery');
  var _ = require('underscore');
  var HomeView = require("./home");
  var LogbookR = require('logbookr/index');
  var LogbookData = require('./logbookData');

  // Defining the application router.
  module.exports = Backbone.Router.extend({

    initialize: function() {
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
      this.openInMain(new HomeView({el: '#tab-content'}));
    },

    logbook: function() {
        this.openInMain(new LogbookR.Navigation({
            goHome: _.bind(Backbone.history.navigate, Backbone.history, "home", { trigger: true }),
            updateTitle: _.bind(this.updateTitle, this),
            openInMain: _.bind(this.openInMain, this),
            mainEl: "#tab-content",
            openInPopover: _.bind(this.openInPopover, this),
            popoverEl: "#popover"
        }).mainView());
    },

    openInMain: function(view) {
      // TODO:
      // remove this later, for now it'll help look for places that rely on $el.
      if (arguments.length > 1)
        throw new Error('Looks like you are trying to .html() in the wrong place.');

      this.mainView = this.view = view.render();
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
