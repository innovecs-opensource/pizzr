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

Pizzr.Views.App = Backbone.View.extend({
	initialize: function() {
		var _this = this
		this.collection.fetch({
			success: function( data ) {
				_this.render()
			}
		})
	},
	templates: {
		what: '<div class="what {{ id }}"><div class="icon"></div><div class="list"></div></div>'
	},
	render: function() {
		var byWhat = this.collection.groupBy('what')
			,wishes
			,view
			,el
		for( what in byWhat ) if ( byWhat.hasOwnProperty( what )) {
			wishes = byWhat[ what ]
			el = $(Mustache.render(this.templates.what, {
				id: what
			}))
			view = new Pizzr.Views.What({ collection: wishes, el: el, what: what })
			this.$el.append( view.render().el )
		}
		return this
	}
})

Pizzr.Views.What = Backbone.View.extend({
	initialize: function( options ) {
		this.what = options.what
	},
	render: function() {
		this.renderWishes()
		return this
	},
	renderWishes: function() {
		this.collection.forEach(function(k) {

		})
	}
})

Pizzr.Views.Wish = Backbone.View.extend({
	render: function() {

	}
})

// app
pizzr = (function() {
	var wishes = new Pizzr.Collections.Wishes
	var pizzr = new Pizzr.Views.App( { el: $('#pizzr'), collection: wishes} )	
	return pizzr
})()
