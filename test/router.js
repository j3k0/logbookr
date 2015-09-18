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

    openInMain: function(view, $el) {
      this.mainView = this.view = view.render();

      // TODO:
      // Reconsider this before merge.
      if ($el) {
        // Let's make sure we are not trying to do view's job here.
        if ($el.length !== 1 || $el[0] === view.el)
          throw new Error('Some fishy .html() stuff, this probably won\'t work!')

        // TODO:
        // not sure whether it is correct .html() argument…
        console.warn('Make sure you are not trying to .html() wrong thing in the wrong place.');
        $el.html(this.mainView.$el);
      }
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
