/*
 * Datasource
 * 
 * Depends on:
 * datastore
 */
(function( $ ) {
	
	$.widget( "ui.datasource", {
		options: {
			type: null,
			source: null
		},
		_create: function() {
			$.ui.datasource.types[ this.options.type ] = this;
			// TODO initialzing items[type] should probably be moved into the populate call 
			$.ui.datastore.main.items[ this.options.type ] = new $.ui.dataitems({
				items: []
			});
			
      $.ui.dataitem.extend(this.options.type)
			
			this.get( this.options.data );
		},
		create: function( props ) {
			// TODO this needs to tell datastore that something changed
			this.options.source.push( props );
		},
		get: function( args ) {
      var that = this,
      store = $.ui.datastore.main,
      data = $.extend({}, this.options.data, args);
      
			if ($.isArray( this.options.source ) ) {
				// TODO pass this (as the datasource instance) instead of type?
				store._populate( this.options.type, this.options.source );
			} else if ( $.type( this.options.source ) == "string" ) {
				$.getJSON( this.options.source, data, function(data) {
					store._populate( that.options.type, data );
				});
			} else if ( $.isFunction( this.options.source ) ) {
				this.options.source( data, function(data) {
					store._populate( that.options.type, data );
				});
			}
		},
		
		update: function(data){
		  var main = $.ui.datastore.main;
		  this.options.data = $.extend({}, this.options.data, data);
		  this.get(main, this.options.data);
		},
		
		save: function( items ) {
			// TODO item.save() isn't actually implemented
			// TODO how useful is it to save each individual item, when saves could/should be batched?
			$.each( items, function( itemId, item ) {
				item.save();
			});
		},
	});
	$.ui.datasource.types = {};
	
})( jQuery );
