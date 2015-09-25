// This is the runtime configuration file.  It complements the Gruntfile.js by
// supplementing shared properties.
require.config({
  paths: {
    // Make vendor easier to access.
    "logbookr": "../src",

    // Some things come from node, so stuff is the same in browser and mocha.
    "backbone":   "../node_modules/backbone/backbone",
    "backbone.localstorage": "../node_modules/backbone.localstorage/backbone.localStorage",
    "underscore": "../node_modules/underscore/underscore",
    "moment": "../node_modules/moment/moment",

    // Map remaining vendor dependencies.
    "jquery":     "libs/jquery/jquery",
    "sweetalert": "libs/sweetalert/lib/sweet-alert",
    "datetimepicker": "libs/curioussolutions-datetimepicker/src/DateTimePicker"
  },

  shim: {
    // This is required to ensure Backbone works as expected within the AMD
    // environment.
    "backbone": {
      // These are the two hard dependencies that will be loaded first.
      deps: ["jquery", "underscore"],

      // This maps the global `Backbone` object to `require("backbone")`.
      exports: "Backbone"
    }
  }
});
