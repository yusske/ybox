(function ($) {

  var Item = Backbone.Model.extend({
    defaults: {
      id: "0",
      songName: "empty",
      creationDate: "",
      comparator: 0,
      counter: 1,
      status:'new'
    }
  });

  var List = Backbone.Collection.extend({
    model: Item,
    url: 'http://localhost:8888/test1/service/getplaylist.php',
    parse: function (response) {
      return response.output;
    }
  });
  var ItemView = Backbone.View.extend({
    tagName: 'li', // name of tag to be created
    // `ItemView`s now respond to two clickable actions for each `Item`: swap and delete.
    className: "js-checksong ui-btn ui-btn-icon-right ui-icon-check",
    events: {
      'click div.swap':  'swap',
      'click span.delete': 'remove'
    },
    attributes: {
    "data-icon": "check"
  },
    // `initialize()` now binds model change/removal to the corresponding handlers below.
    initialize: function(){
      _.bindAll(this, 'render', 'unrender', 'swap', 'remove'); // every function that uses 'this' as the current object should be in here

      this.model.bind('change', this.render);
      this.model.bind('remove', this.unrender);
    },
    // `render()` now includes two extra `span`s corresponding to the actions swap and delete.
    render: function(){
      var that = this;
      $.get('tweetsTemplate.html', function (data) {
        that.template = _.template(data, {});
      }, 'html').done(function () {
          that.onSucess();
      });
      return this;
    },
    // `unrender()`: Makes Model remove itself from the DOM.
    unrender: function(){
      $(this.el).remove();
    },
    // `swap()` will interchange an `Item`'s attributes. When the `.set()` model function is called, the event `change` will be triggered.
    swap: function(){
      console.log('swap');
     $(this.el).toggleClass('ui-btn-b');
      var that = this;
      var status=(this.model.status!='played')?'played':'new'
      $.ajax({
        url: 'http://localhost:8888/test1/service/checksong.php',
        type: 'GET',
        data:{id: this.model.id,s:status},
        success: function (data, textStatus, jqXHR) {
          if (data.output.status === 'played'){
              $(that.el).addlCass('ui-btn-b');
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log('error...')
        }
      });
    },
    // `remove()`: We use the method `destroy()` to remove a model from its collection. Normally this would also delete the record from its persistent storage, but we have overridden that (see above).
    remove: function(){
      this.model.destroy();
    },
    onSucess: function (data){
         $(this.el).html(this.template({
          song: this.model.toJSON()
        }));
         if (this.model.attributes.status=='played'){
          $(this.el).addClass('ui-btn-b');
         }
        return this;
    }
  });
  // Because the new features (swap and delete) are intrinsic to each `Item`, there is no need to modify `ListView`.
  var ListView = Backbone.View.extend({
    el: $('body'), // el attaches to existing element
    events: {
      'click button#clear': 'clearList',
      'click .js-checksong': "checkSong"
    },
    initialize: function () {
      _.bindAll(this, 'render', 'updateCounter'); // every function that uses 'this' as the current object should be in here
      var that = this;
      this.getSongs();
      setInterval(function () {
        that.getSongs();
      }, 15000);
    },
    getSongs: function () {
      var entityList = new List();
      entityList.comparator = function (chapter) {
        return -chapter.get('counter'); // Note the minus! for desc order
      };
      var that = this;
      entityList.fetch({
        success: function (collection, response) {
          console.log(response);
          that.collection = collection;
          that.counter = 0; // total number of items added thus far
          that.render();
        },
        error: function (er) {
          console.log(er);
        }
      });
    },
    clearList: function () {
      var that = this;
      $.ajax({
        url: 'http://localhost:8888/test1/service/clearplaylist.php',
        type: 'post',
        success: function (data, textStatus, jqXHR) {
          that.getSongs();
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log('error...')
        }
      });
    },
    render: function () {
      $('#playlist').empty();
      var self=this;
      _(this.collection.models).each(function(item){ // in case collection is not empty
        self.appendItem(item);
      }, this);
    },
    appendItem: function(item){
      var itemView = new ItemView({
        model: item
      });
      $('#playlist', this.el).append(itemView.render().el);
      $('#playlist').listview('refresh');
    },
    updateCounter: function () {
      var n = Math.random() * this.collection.length;
      var i = Math.floor(n);
      var c = this.collection.models[i].get('counter');
      c++;
      this.collection.models[i].set({
        counter: c
      });
      this.collection.sort();
      this.render();
    }
  });

  var listView = new ListView();
})(jQuery);