// This is the runtime configuration file.  It complements the Gruntfile.js by
// supplementing shared properties.
require.config({
  paths: {
    // Make vendor easier to access.
    "logbookr": "../src",

    // Opt for Lo-Dash Underscore compatibility build over Underscore.
    "underscore": "libs/lodash/dist/lodash.underscore",

    // Map remaining vendor dependencies.
    "jquery":     "libs/jquery/jquery",
    "backbone":   "libs/backbone/backbone",
    "backbone.localStorage":   "libs/backbone.localStorage/backbone.localStorage",
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
    },
  }
});
