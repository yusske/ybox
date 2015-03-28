define(function (require) {
  var Backbone = require('backbone'),
    url = require('urlHelper');
  var Item = Backbone.Model.extend({
    urlRoot: url.getHttpHost() + url.getPlaylistService(),
    defaults: {
      track: 'empty',
      artist: 'empty',
      comparator: 0,
      counter: 1,
      status: 'new',
      track_id: '',
      mode: 'BAR',
      slug: '',
      session_id: '0-0'
    }
  });

  var List = Backbone.Collection.extend({
    model: Item,
    url: url.getHttpHost() + url.getPlaylistService()
  });

  var ItemView = Backbone.View.extend({
    tagName: 'li', // name of tag to be created
    // `ItemView`s now respond to two clickable actions for each `Item`: swap and delete.
    events: {
      'click span.swap': 'swap',
      'click span.delete': 'remove'
    },
    id: function () {
      return 'itemId_' + this.model.get("id");
    },


    // `initialize()` now binds model change/removal to the corresponding handlers below.
    initialize: function () {
      _.bindAll(this, 'render', 'unrender', 'remove'); // every function that uses 'this' as the current object should be in here
      this.model.bind('change', this.render);
      this.model.bind('remove', this.unrender);
      this.model.on('change', this.render, this);
    },
    // `render()` now includes two extra `span`s corresponding to the actions swap and delete.
    render: function () {
      var songName = this.model.get('track');// + ' - ' + this.model.get('artist');
      $(this.el).html(songName);
      return this; // for chainable calls, like .render().el
    },
    checkItem: function () {

      var songName = this.model.get('track'); //+ ' - ' + this.model.get('artist');
      var itemId = '#itemId_' + this.model.get('id');

      if (this.model.get('status') === 'played') {
        $(itemId).empty();
        $(itemId).html(songName);
        $(itemId).addClass('ui-btn-b ui-btn ui-btn-icon-right ui-icon-check');
        $("ol").listview("refresh");

      }else{
        $(itemId).removeClass('ui-btn-b ui-btn ui-btn-icon-right ui-icon-check');
      }
    },
    // `unrender()`: Makes Model remove itself from the DOM.
    unrender: function () {
      $(this.el).remove();
    },
    // `remove()`: We use the method `destroy()` to remove a model from its collection. Normally this would also delete the record from its persistent storage, but we have overridden that (see above).
    remove: function () {
      this.model.destroy();
    }
  });

  // Because the new features (swap and delete) are intrinsic to each `Item`, there is no need to modify `ListView`.
  var ListView = Backbone.View.extend({
    el: $('body'), // el attaches to existing element
    events: {
      'click button#add': 'addItem'
    },
    initialize: function () {
      _.bindAll(this, 'render', 'addItem', 'appendItem'); // every function that uses 'this' as the current object should be in here
      var that = this;
      ga(function (tracker) {
        var clientId = tracker.get('clientId');
        console.log(clientId);
        that.clientId = clientId;
      });
      this.getSongs(true);
      setInterval(function () {
        that.getSongs(false);
      }, 15000);
    },
    getSongs: function (render) {
      var entityList = new List();
      entityList.comparator = function (chapter) {
        return chapter.get('id'); // Note the minus! for desc order
      };
      var self = this;
      entityList.fetch({
        data: {
          session_id: self.clientId,
          slug: __bar,
          mode: __mode
        },
        success: function (collection, response) {
          console.log(response);
          self.collection = collection;
          self.collection.bind('add', this.appendItem); // collection event binder
          self.counter = 0; // total number of items added thus far
          if (render) {
            self.render();
          }
          self.checkStatus();
        },
        error: function (er) {
          console.log(er);
        }
      });
    },
    render: function () {
      var self = this;
      _(this.collection.models).each(function (item) { // in case collection is not empty
        self.appendItem(item);
      }, this);
    },
    checkStatus: function () {
      var self = this;
      _(this.collection.models).each(function (item) {
        var itemView = new ItemView({
          model: item
        });
        itemView.checkItem();
      }, this);
    },

    addItem: function () {
      var title = $('#title').val();
      if ($.trim(title) == '')
        return false;
      this.counter++;
      var self = this;
      var item = new Item();
      item.save({
        track: title,
        session_id: self.clientId,
        slug: __bar,
        mode: __mode,
        track_id: Math.random()
      }, {
        success: function (data) {
          var changed = data.changed.Playlist;
         /* var item = new Item({
            track: changed.track,
            artist: changed.artist,
            status: changed.status,
            track_id: changed.track_id,
            mode: changed.mode,
            session_id: changed.session_id,
            id: changed.id
          });*/
          self.appendItem(data);
        }
      });
      $('#title').val('');
    },
    appendItem: function (item) {

      var itemView = new ItemView({
        model: item
      });
      $('ol', this.el).append(itemView.render().el);
      $("ol").listview("refresh");
    }
  });

  var listView = new ListView();

});