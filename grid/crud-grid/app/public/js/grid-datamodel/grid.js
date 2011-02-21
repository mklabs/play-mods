/*
 * Grid
 * 
 * Depends on:
 * tmpl
 * datastore
 * 
 * Optional:
 * extractingDatasource
 */
(function( $ ) {

$.widget( "ui.grid", {
	options: {
		columns: null,
		type: null,
		rowTemplate: null
	},
	_create: function() {
	  
		var that = this,
			totalWidth = 0,
			colWidths = this.element.find( "td:eq(0)" ).parent( "tr" ).children().map(function() {
				var width = $(this).outerWidth();
				totalWidth += width
				return width;
			});

		// Create the grid
		var uiGrid = ( this.uiGrid = $("<div class='ui-widget ui-grid'></div>") )
				.insertBefore( this.element ),

			// Add grid head and grid body
			uiGridHead = ( this.uiGridHead = $("<div class='ui-grid-head'></div>") )
				.appendTo( uiGrid ),
			uiGridBody = ( this.uiGridBody = $("<div class='ui-widget-content ui-grid-body'></div>") )
				.appendTo( uiGrid ),
			uiGridFoot = ( this.uiGridFoot = $("<div class='ui-widget-header ui-grid-foot'></div>") )
				.appendTo( uiGrid ),

			// New table in grid head for column headers
			uiGridHeadTable = ( this.uiGridHeadTable = $("<table class='ui-widget-content ui-grid-head-table'></table>") )
				.appendTo( uiGridHead );

			// Existing table in grid body for the body table
			uiGridBodyTable = ( this.uiGridBodyTable = this.element )
				.addClass( "ui-grid-body-table" )
				.appendTo( uiGridBody );

		// Move table CAPTION to grid head
		uiGridBodyTable.find( "caption" ).addClass( "ui-widget-header" )
			.prependTo( uiGridHeadTable );

		// Give head rows a clickable state
		uiGridBodyTable.find( "tr" ).addClass( "ui-state-default" );

		// Give head cells a clickable state
		this._hoverable( uiGridBodyTable.find("th").addClass("ui-state-default") );

		// Give body rows a clickable state
		this._hoverable( uiGridBodyTable.find( "tr" ).addClass( "ui-state-default" ) );

		// Give body cells a clickable state
		uiGridBodyTable.find( "td" ).addClass( "ui-state-default" );

		uiGrid.bind( "resize", function() {
			that.refresh();
		});
		
		this._type();
		this._columns();
		this._rowTemplate();
		this.element.delegate( "tbody > tr", "click", function( event ) {
			that._trigger( "select", event, {
				item: $.ui.datastore.main.get( that.options.type,
					$( this ).tmplItem().data.guid )
			});
		});
		
		this.items = $.ui.datastore.main.get( this.options.type );
		// if data is already available, refresh directly
		if (this.items.options.items.length) {
			this.refresh();
		}
		$(this.items).bind("dataitemsdata", function() {
		  console.log('dataitemsdata triggered!');
			that.refresh();
		});
	},
	refresh: function() {
    console.log('refresh my body!');
		var tbody = this.element.find( "tbody" ).empty(),
			template = this.options.rowTemplate;
		// TODO try to replace $.each with passing an array to $.tmpl, produced by this.items.something()
		// TODO how to refresh a single row?
		$.each( this.items.options.items, function( itemId, item ) {
			// TODO use item.toJSON() or a method like that to compute values to pass to tmpl
			$.tmpl( template, item.options.data ).appendTo( tbody );
		});
		tbody.find( "td" ).addClass( "ui-widget-content" );
	},
	
	_type: function() {
		if ( !this.options.type ) {
			// doesn't cover generationg the columns option or generating headers when option is specified
			this.options.type = new $.ui.extractingDatasource( {
				// TODO generate columns first, and pass along?
				table: this.element
			}).type();
		}
	},
	
	_columns: function() {
		if ( this.options.columns ) {
			// TODO check if table headers exist, generate if not
			return;
		}
		this.options.columns = this.element.find( "th" ).map(function() {
			var field = $( this ).data( "field" );
			if ( !field ) {
				// generate field name if missing
				field = $( this ).text().toLowerCase().replace(/\s|[^a-z0-9]/g, "_");
			}
			return field;
		}).get()
	},

	_rowTemplate: function() {
		if ( this.options.rowTemplate ) {
			return;
		}
		var template = $.map( this.options.columns, function( field ) {
			return "<td>${" + field + "}</td>";
		}).join( "" );
		template = "<tr>" + template + "</tr>";
		this.options.rowTemplate = template;
	}
});

})( jQuery );
