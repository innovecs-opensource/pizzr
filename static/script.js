rand_id = function() {
	return Math.ceil( Math.random() * (1 << 30) ).toString(36)
}

Pizzr = {
	Models: {},
	Collections: {},
	Views: {}
}

Pizzr.Models.Wish = Backbone.Model.extend({
	// url: 'wish',
	urlRoot: 'wish',
	idAttribute: '_id',
	setMy: function( ) {
		window.localStorage.setItem( 'pizzr_' + this.get('_id'), true )
	},
	isMy: function( ) {
		return !!window.localStorage.getItem( 'pizzr_' + this.get('_id') )
	}
})

Pizzr.Collections.Wishes = Backbone.Collection.extend({
	url: 'wish',
	model: Pizzr.Models.Wish
})

Pizzr.Templates = {
	what: '<div class="icon icon-{{ what }}"></div><ol class="list"></ol>{{^ readonly }}<form><input type="text" placeholder="My Name" {{# name }} value="{{ name }}" {{/ name }} class="who" name="who"><button class="add">I want</button></form>{{/ readonly }}',
	wish: '<span{{# my }} class="my"{{/ my }}>{{ who }}</span>{{# my }}<span class="delete"></span>{{/ my }}'
}

Pizzr.Views.App = Backbone.View.extend({
	initialize: function() {
		var _this = this
		this.poll()
	},
	updated: 0,
	poll: function() {
		var _this = this;
		$.get('/is_updated/' + this.updated, function(data) {
			if (_this.updated != data) {
				_this.updated = data;
				_this.collection.fetch({
					success: function( data ) {
						_this.render()
					}
				})	
			}

			setTimeout( function() { _this.poll() }, 400 )
		})
	},
	types: ['pizza', 'sushi', 'booze', 'tram', 'island'],
	saveName: function( name ) {
		window.localStorage.setItem( 'myName', name )
		this.trigger('name:change')
	},
	getName: function() {
		return window.localStorage.getItem( 'myName' ) 
	},
	isReadOnly: function() {
		return window.location.hash == '#readonly'
	},
	render: function() {
		var byWhat = this.collection.groupBy('what')
			,wishes
			,view
			,el
		this.$el.empty()

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
		'submit' : 'addMe'
	},
	initialize: function( options ) {
		this.what = options.what
		this.$el.addClass( this.what )
		this.app = options.app

		this.collection.on('add', this.render, this)
		this.collection.on('remove', this.render, this)

		this.app.on('name:change', this.render, this)
	},
	render: function() {
		var attrs = {
			what: this.what,
			readonly: this.app.isReadOnly(),
			name: this.app.getName()
		}
		this.$el.html( Mustache.render( Pizzr.Templates.what, attrs ))
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
		if (!who) return false;

		this.app.saveName( who )

		var obj = new Pizzr.Models.Wish({
				who: who,
				what: this.what,
				_id: rand_id()
			})

		obj.setMy()
		this.collection.push( obj )
		obj.save()

		return false;
	}
})

Pizzr.Views.Wish = Backbone.View.extend({
	tagName: 'li',
	events: {
		'click .delete' : 'delete'
	},
	delete: function() {
		this.model.destroy()
	},
	render: function() {
		attrs = _.extend( { my: this.model.isMy() }, this.model.attributes )
		this.$el.html( Mustache.render( Pizzr.Templates.wish, attrs ) )
		return this
	}
})

// app
pizzr = (function() {
	var wishes = new Pizzr.Collections.Wishes
	var pizzr = new Pizzr.Views.App( { el: $('#pizzr'), collection: wishes} )	
	return pizzr
})()
