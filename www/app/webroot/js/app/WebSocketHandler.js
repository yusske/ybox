define(function (require) {
  'use strict';

  /**
  @SocketsHandler sockets handler,
  **/
  var Backbone = require('backbone'),
    $ = require('jquery'),

    url = require('urlHelper');

  // WebSockets private variable
  var socket;

  var SocketHandler = _.extend({
    // Initialize webSocket
    init: function () {
      // We can access the app
      //this.app = app;

      socket = new WebSocket('ws://' + url.getHost() + url.getPlaylistService());

      //handle when user reloads page, closes browser or changes url
      window.onbeforeunload = function() {
        socket.onclose = function () {}; // disable onclose handler first
        socket.close();
      };

      //handle when user reloads page, closes browser or changes url
      window.onbeforeunload = function() {
        socket.onclose = function () {}; // disable onclose handler first
        socket.close();
      };

      socket.onopen = function (evt) {
        this.trigger('socket:open', evt);
      }.bind(this);

      // this will trigger some event-name currently setted and sent by server side
      // we need to listen to them and do the SocketHandler.on('foo', callback) kind of bindings
      socket.onmessage = function (evt) {
        var name,
          data = $.parseJSON(evt.data);
        if (evt.data) {

          switch (data.token) {
          case 'playlist':
           // name = actionConstants.INIT;
           name='playlist';
            break;
          default:
            break;
          }
        }
        this.trigger(name, data);
      }.bind(this);

      socket.onclose = function () {
        this.trigger('socket:close');
      }.bind(this);

      socket.onerror = function (err) {
        this.trigger('socket:error', err);
      }.bind(this);
    },
    // send a websocket message
    send: function (msg) {
      socket.send((typeof msg !== 'string') ? JSON.stringify(msg) : msg);
    }

  }, Backbone.Events);

  return SocketHandler;
});