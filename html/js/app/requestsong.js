// **This example introduces two new Model actions (swap and delete), illustrating how such actions can be handled within a Model's View.**
//
// _Working example: [5.html](../5.html)._

//
(function ($) {
  // `Backbone.sync`: Overrides persistence storage with dummy function. This enables use of `Model.destroy()` without raising an error.
  var Item = Backbone.Model.extend({
    defaults: {
      id: "0",
      songName: "empty",
      creationDate: "",
      comparator: 0,
      counter: 1,
      status: 'new',
      clientid:''
    }
  });

  var List = Backbone.Collection.extend({
    model: Item,
    url: function (){ return 'http://'+window.location.host+'/ybox/service/getplaylist.php?cid='+$('#cid').val(); },
    parse: function (response) {
      return response.output;
    }
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
      if (this.model.get('status') === 'played'){
              $(this.el).html("<a href='#'>"+ this.model.get('songName')+'</a>');
              $(this.el).attr('data-theme','b');
              $(this.el).attr('data-icon','check');
          }
          else{
            $(this.el).html(this.model.get('songName'));
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
      entityList.fetch({
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
      var item = new Item();
      item.set({
        songName: title,
        clientid: clientid
      });
      var self = this;
      $.ajax({
        type: "POST",
        url: 'http://'+window.location.host+'/ybox/service/createplaylist.php',
        data: {
          sn: title,
          cid: clientid
        }
      }).done(function () {
        self.appendItem(item);
      });
      $('#title').val('');
    },
    appendItem: function (item) {
      /*  var value = $('#title').val();
        if ($.trim(value) == '')
          return false;*/

      var itemView = new ItemView({
        model: item
      });
      $('ol', this.el).append(itemView.render().el);
      $("ol").listview("refresh");
      window.scrollTo(0, document.body.scrollHeight);
    }
  });

  var listView = new ListView();
})(jQuery);