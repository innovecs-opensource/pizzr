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
	types: ['pizza', 'sushi', 'booze'],
	render: function() {
		var byWhat = this.collection.groupBy('what')
			,wishes
			,view
			,el

		_(this.types).forEach(function( type ) {
			view = new Pizzr.Views.What({
				collection: new Pizzr.Collections.Wishes( byWhat[ type ] ),
				what: type,
				app: this
			})
			this.$el.append( view.render().el )
		}, this)
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

		this.collection.on('add', this.render, this)
		this.collection.on('remove', this.render, this)

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
		this.collection.last().save()
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
