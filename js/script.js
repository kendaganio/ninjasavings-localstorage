(function($){

  window.Saving = Backbone.Model.extend({
    defaults: {
      amount: 0,
      date_posted: ''
    },

    clear: function(){
      this.destroy();
    }
  });

  window.SavingCollection = Backbone.Collection.extend({
    model: Saving,
    localStorage: new Store("savings_account")
  });

  var Savings = new SavingCollection;

  window.SavingView = Backbone.View.extend({
    tagName: 'li',
    className: 'saving',

    template: _.template($('#saving-item').html()),

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
  });

  window.AppView = Backbone.View.extend({
    el: $('#savings-app'),

    events: {
      "keypress #input": "createOnEnter"
    },

    initialize: function(){
      this.input = this.$("#input");
      this.totalAmt = $("#total-savings");

      Savings.bind('all', this.render, this);
      Savings.bind('add', this.addOne, this);
      Savings.bind('reset', this.addAll, this);

      Savings.fetch();
    },

    render: function(){
      this.totalAmt.text(this.amount);
    },

    addOne: function(saving){
      var view = new SavingView({model: saving});
      this.$('#list').append(view.render().el);
    },

    addAll: function(){
      Savings.each(this.addOne);
    },

    createOnEnter: function(e){
      if(e.keyCode != 13) return;
      if(!this.input.val()) return;

      Savings.create({ amount: this.input.val(), date_posted: new Date()})
      this.input.val('');
    }

  });

  var App = new AppView;
})(jQuery);