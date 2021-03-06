// Break out the application running from the configuration definition to
// assist with testing.

require(["config"], function() {
  "use strict";
  // Kick off the application.

  require(["router", "logbookr/index"], function(Router, LogbookR) {

    // Define your master router on the application namespace and trigger all
    // navigation from this instance.
    var router = new Router();
    $(document).ready(function(){
        Backbone.history.start(); //{ pushState: true, root: app.root });
    });

  });
});
