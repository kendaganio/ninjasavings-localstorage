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

    initialize: function(){
      this.model.bind('destroy', this.remove, this);
    },

    events: {
      "click .del": "delete"
    },

    template: _.template($('#saving-item').html()),

    render: function(){
      this.$el.html(this.template(this.model.toJSON())).hide();
      this.$el.fadeIn('slow');
      return this;
    },

    delete: function(){
      totalAmount -= parseInt(this.model.get('amount'));
      this.model.clear();
    }
  });

  window.totalAmount = 0;
  window.AppView = Backbone.View.extend({
    el: $('#savings-app'),

    events: {
      "keypress #input": "createOnEnter"
    },

    initialize: function(){
      this.input = this.$("#input");
      this.total = this.$("#total-savings");

      Savings.bind('all', this.render, this);
      Savings.bind('add', this.addOne, this);
      Savings.bind('reset', this.addAll, this);

      Savings.fetch();
    },

    render: function(){
      this.total.text(totalAmount);
    },

    addOne: function(saving){
      var view = new SavingView({model: saving});
      this.$('#list').append(view.render().el);
      totalAmount += parseInt(saving.get('amount'));
      console.log(totalAmount);
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