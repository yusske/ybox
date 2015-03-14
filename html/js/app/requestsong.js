define(function (require) {
  var Backbone = require('backbone');
  // `Backbone.sync`: Overrides persistence storage with dummy function. This enables use of `Model.destroy()` without raising an error.
  var Item = Backbone.Model.extend({
    urlRoot: 'http://' + window.location.host + '/ybox/www/playlist',
    defaults: {
      track: 'empty',
      artist: 'empty',
      comparator: 0,
      counter: 1,
      status: 'new',
      track_id: '',
      mode: 'BAR',
      slug: '',
      user_id: ''
    }
  });

  var List = Backbone.Collection.extend({
    model: Item,
    url: 'http://' + window.location.host + '/ybox/www/playlist'
  });

  var ItemView = Backbone.View.extend({
    tagName: 'li', // name of tag to be created
    // `ItemView`s now respond to two clickable actions for each `Item`: swap and delete.
    events: {
      'click span.swap': 'swap',
      'click span.delete': 'remove'
    },

    // `initialize()` now binds model change/removal to the corresponding handlers below.
    initialize: function () {
      _.bindAll(this, 'render', 'unrender', 'remove'); // every function that uses 'this' as the current object should be in here

      this.model.bind('change', this.render);
      this.model.bind('remove', this.unrender);
    },
    // `render()` now includes two extra `span`s corresponding to the actions swap and delete.
    render: function () {
      var songName = this.model.get('track') + ' - ' + this.model.get('artist');
      if (this.model.get('status') === 'played') {
        $(this.el).html("<a href='#'>" + songName + '</a>');
        $(this.el).attr('data-theme', 'b');
        $(this.el).attr('data-icon', 'check');
      } else {
        $(this.el).html(songName);
      }
      return this; // for chainable calls, like .render().el
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
      this.getSongs();
      setInterval(function () {
        that.getSongs();
      }, 15000);
    },
    getSongs: function () {
      var entityList = new List();
      entityList.comparator = function (chapter) {
        return chapter.get('id'); // Note the minus! for desc order
      };
      var that = this;
      var cid = $('#cid').val();
      entityList.fetch({
        data: {
          userid: cid,
          slug: 'marcohaus',
          mode: 'BAR'
        },
        success: function (collection, response) {
          console.log(response);
          that.collection = collection;
          that.collection.bind('add', this.appendItem); // collection event binder
          that.counter = 0; // total number of items added thus far
          that.render();
        },
        error: function (er) {
          console.log(er);
        }
      });
    },
    render: function () {
      $('ol').empty();
      var self = this;
      _(this.collection.models).each(function (item) { // in case collection is not empty
        self.appendItem(item);
      }, this);
    },
    addItem: function () {
      var title = $('#title').val();
      var clientid = $('#cid').val();
      if ($.trim(title) == '')
        return false;
      this.counter++;
      var self = this;
      var item = new Item({
        track: title,
        user_id: clientid,
        slug: 'marcohaus',
        mode: 'BAR'
      });
      item.save({
        success: function () {
          self.appendItem(item);
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