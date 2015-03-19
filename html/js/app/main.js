require.config({
  paths: {
    // the left side is the module ID,
    // the right side is the path to
    // the jQuery file, relative to baseUrl.
    // Also, the path should NOT include
    // the '.js' file extension. This example
    // is using jQuery 1.9.0 located at
    // js/lib/jquery-1.9.0.js, relative to
    // the HTL page.
    jquery: '../vendor/jquery/jquery',
    underscore: '../vendor/underscore/underscore-master/underscore',
    json:'../vendor/json/JSON-js-master/json2',
    backbone: '../vendor/backbone/backbone',
    jquerymobile:'../vendor/jquerymobile/jquerymobile',
    googleAnalytics:'../vendor/Google/googleAnalyticsHandler'

    //marionette: 'vendor/backbone.marionette/core/backbone.marionette'
  },
  shim: {
    jquery: {
      exports: '$'
    },
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    jquerymobile:{
      deps: ['jquery', 'underscore'],
      exports:'jquerymobile'
    }
  }
});

require(['jquery', 'jquerymobile']);