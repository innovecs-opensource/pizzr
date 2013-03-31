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
	model: 'Pizzr.Models.Wish'
})

Pizzr.Views.AppView = Backbone.View.extend({
	initialize: function() {
		 // = 
	}
})

// app
pizzr = (function() {
	var wishes = new Pizzr.Collections.Wishes
	wishes.fetch()

	var pizzr = new Pizzr.Views.AppView( {collection: wishes} )	
	return pizzr
})
