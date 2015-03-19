define(['backbone', 'jquery'], function (Backbone, $) {
  'use strict';
  /**
  @GoogleAnalyticsHandler Google Analytics (GA) handler,
  **/

  /* Code snippet from Google Analytics */

  window._gaq = window._gaq || [];
  _gaq.push(['_setAccount', 'UA-30410576-1']);
  //_gaq.push(['_setAccount', 'UA-30410576-2']); //tracking code for testing purposes
  _gaq.push(['_setAllowLinker', true]);
  //_gaq.push(['_setDomainName', 'none']);//script for testing purposes
  _gaq.push(['_trackPageview']);

  window.ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  //ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/u/ga_debug.js'; //script for testing purposes
  ga.id = "google-analytics-script";
  window.s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);

  /* end of the code snippet***/

  var GoogleAnalyticsHandler = _.extend({
    // send a GA  message
    trackEvent: function (category, action, label, value) {
      _gaq.push(['_trackEvent', category, action, label, value]);
    },
    sendPageView: function (viewName) {
      _gaq.push(['_trackPageview', '/' + viewName]);
    }
  }, Backbone.Events);

  return GoogleAnalyticsHandler;
});