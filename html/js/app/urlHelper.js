define(function (require) {
  'use strict';
  var baseUrl = '',
    PLAYLIST_URL = '/ybox/www/playlist';
  var url = {
    getBaseUrl: function () {
      if (!baseUrl) {
        baseUrl = location.host;
        baseUrl = baseUrl + location.pathname;
      }
      return baseUrl;
    },
    getHttpBaseUrl: function () {
      return 'http://' + this.getBaseUrl();
    },
    getHttpHost: function () {
      return 'http://' + location.host;
    },
     getHost: function () {
      return location.host;
    },
    getPlaylistService: function () {
      return PLAYLIST_URL;
    }
  };
  return url;
});