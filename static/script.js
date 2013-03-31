Pizzr = {
	Models: {},
	Collections: {},
	Views: {}
}

Pizzr.Models.Wish = Backbone.Model.extend({
	url: 'wish'
})

Pizzr.Collections.Wishes = Backbone.Collection.extend({
	url: 'wish',
	model: Pizzr.Models.Wish
})

Pizzr.Templates = {
	what: '<div class="icon icon-{{ what }}"></div><ul class="list"></ul><input type="text" placeholder="My Name" class="who" name="who"><button class="add">I want</button>',
	wish: '{{ who }}'
}

Pizzr.Views.App = Backbone.View.extend({
	initialize: function() {
		var _this = this
		this.collection.fetch({
			success: function( data ) {
				_this.render()
			}
		})
	},
	render: function() {
		var byWhat = this.collection.groupBy('what')
			,wishes
			,view
			,el

		for(what in byWhat) if (byWhat.hasOwnProperty( what )) {
			wishes = new Pizzr.Collections.Wishes( byWhat[ what ] )
			view = new Pizzr.Views.What({
				collection: wishes,
				what: what,
				app: this
			})
			this.$el.append( view.render().el )
		}
		return this
	}
})

Pizzr.Views.What = Backbone.View.extend({
	className: 'what',
	events: {
		'click .add' : 'addMe'
	},
	initialize: function( options ) {
		this.what = options.what
		this.$el.addClass( this.what )
		this.app = options.app
	},
	render: function() {
		this.$el.html( Mustache.render( Pizzr.Templates.what, {what: this.what} ))
		this.renderWishes()
		return this
	},
	renderWishes: function() {
		var view
			,el
			,list = this.$el.find('.list')

		this.collection.forEach(function(k) {
			view = new Pizzr.Views.Wish({ model: k })
			list.append( view.render().el )
		})
	},
	addMe: function() {
		var who = this.$el.find('.who').val()
		this.collection.push({
			who: who,
			what: this.what
		})
		this.collection.sync()
	}
})

Pizzr.Views.Wish = Backbone.View.extend({
	tagName: 'li',
	render: function() {
		this.$el.html( Mustache.render( Pizzr.Templates.wish, this.model.attributes ) )
		return this
	}
})

// app
pizzr = (function() {
	var wishes = new Pizzr.Collections.Wishes
	var pizzr = new Pizzr.Views.App( { el: $('#pizzr'), collection: wishes} )	
	return pizzr
})()
