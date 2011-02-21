Integrating Play framework with jQuery UI Grid
-------------------------------------------------

This Play! app uses an inner crud-grid play! module that takes care of all assets (js/css) related to the jQuery UI Grid widget. This experiment is heavily inspired by [Integrating Play framework with jQuery DataTables](//www.lunatech-research.com/archives/2011/01/28/playframework-jquery-datatables) and [Ajax DataTables with the Play framework](//www.lunatech-research.com/archives/2011/02/07/ajax-datatables-playframework) articles from [Lunatech Research](//www.lunatech-research.com/editorials/tags/play). This app is a slight variation to use the new UI Grid widget.

More than three weeks ago, The jQuery UI Team [has announced](http://blog.jqueryui.com/2011/02/unleash-the-grid/) that they are building a grid widget. Here are downloaded current widget sources from jQuery UI [grid branch](//github.com/jquery/jquery-ui/tree/grid). The widget development takes place in three subfolders: grid-datamodel, grid-markup and grid-type - in this example we'lle dig in the first one. 

## Example application

We use exactly the same example than Lunatech's one as local timezones case is a perfect fit to play with a grid widget. So, let's start with the model:

    package models;

    import java.util.Locale;
    import java.util.TimeZone;
    import javax.persistence.Entity;
    import play.db.jpa.Model;

    @Entity
    public class LocalisedTimeZone extends Model {

       public String timeZoneId;
       public String name;
       public String language;
       public int offset;

       public LocalisedTimeZone(TimeZone zone, Locale locale) {
          this.timeZoneId = zone.getID();
          this.name = zone.getDisplayName(locale);
          this.language = locale.getDisplayLanguage();
          this.offset = zone.getRawOffset() / 3600000;
       }
    }
  
and the application bootstrap that builds up our entire test case, it basically goes through the list of timezones and stores them in db.

    package controllers;

    import java.util.Locale;
    import java.util.TimeZone;
    import models.LocalisedTimeZone;
    import play.jobs.Job;
    import play.jobs.OnApplicationStart;

    @OnApplicationStart
    public class Bootstrap extends Job {

    	@Override
    	public void doJob() {
    		if (LocalisedTimeZone.count() == 0) {
    			for (String id : TimeZone.getAvailableIDs()) {
    				final TimeZone zone = TimeZone.getTimeZone(id);
    				new LocalisedTimeZone(zone, Locale.ENGLISH).save();
    				new LocalisedTimeZone(zone, Locale.FRENCH).save();
    				new LocalisedTimeZone(zone, new Locale("nl")).save();
    			}
    		}
    	}

    }
    

Next, we'll have to provide our CRUD controller with the ability to return the model in a json format. It's sill based on Lunatech's example but's due to the UI grid model, it becames far simpler. We moved from:

    package controllers;

    import java.lang.reflect.Field;
    import java.util.List;

    import play.Logger;
    import play.db.Model;


    public class CrudJson extends CRUD {

       /**
       * Controller method for DataTables, based on
       * {@link CRUD#list(int, String, String, String, String)}
       * with unused request parameters.
       */
       public static void listJson(int page, String search, String searchFields,
          String orderBy, String order) {
         ObjectType type = ObjectType.get(getControllerClass());
         notFoundIfNull(type);
         if (page < 1) {
          page = 1;
         }
         final List<Model> objects = type.findPage(page, search, searchFields,
          orderBy, order, (String) request.args.get("where"));
         renderJSON(new DataTablesSource(type, objects));
       }

       /**
       * JSON wrapper for a list of model objects, for use by DataTables.
       */
       private static class DataTablesSource {
         private String[][] aaData;

         public DataTablesSource(ObjectType type, List<Model> objects) {
          this.aaData = new String[objects.size()][type.getFields().size()];
          for (int column = 0; column < type.getFields().size(); column++) {
            final ObjectType.ObjectField objectField = type.getFields().get(column);
            for (int rowIndex = 0; rowIndex < objects.size(); rowIndex++) {
              try {
                final Field field = type.entityClass.getField(objectField.name);
                final String value = field.get(objects.get(rowIndex)).toString()
                aaData[rowIndex][column] = value;
              }
              catch (Exception e) {
                Logger.error("Could not read field " + objectField.name);
              }
            }
          }
         }
       }
    }
    
to

    package controllers;

    import java.lang.reflect.Field;
    import java.util.List;

    import play.Logger;
    import play.db.Model;

    public class CrudJson extends CRUD {

    	/**
    	 * Controller method for UI Grid, based on
    	 * {@link CRUD#list(int, String, String, String, String)} with unused
    	 * request parameters.
    	 */
    	public static void listJson(int page, String search, String searchFields, String orderBy, String order) {
    		ObjectType type = ObjectType.get(getControllerClass());

    		notFoundIfNull(type);

    		if (page < 1) {
    			page = 1;
    		}

    		final List<Model> objects = type.findPage(
    			page, 
    			search, 
    			searchFields, 
    			orderBy, 
    			order, 
    			(String) request.args.get("where")
    		);

    		renderJSON(objects);
    	}
    }

Now, let's have a look at the view (app/views/CRUD/list.html):

    #{extends 'CRUD/layout.html' /}

    <div id="crudList" class="${type.name}">

        <div id="crudListSearch">
          #{crud.search /}
        </div>


        <table class="crud-grid">
          <caption>UI Grid integration with Play! Crud module</caption>
          <thead>
            <tr>
              <th data-field="timeZoneId">yayTimezone</th>
              <th data-field="name">Name</th>
              <th data-field="language">language</th>
              <th data-field="offset">offset</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>


        <div id="crudListPagination">
          #{crud.pagination /}
        </div>

    </div>
  
We removed the crud.table template tag to use the ui grid markup. Note the use of html5 data-attribute field on each col. They will be used by the grid widget to map proper value from datasource.

Next, we'll have to set up assets needed by the grid widget:

    #{set 'css'}
      <link rel="stylesheet" type="text/css" media="screen" href="/grid/css/themes/base/jquery.ui.all.css">
      <link rel="stylesheet" type="text/css" media="screen" href="/grid/js/grid-datamodel/grid.css">
    #{/set}

This is a powerfull feature of playfremework which allows inner template to define arbitrary markup (and allows the definition of css/js import) that gets automatically decorated in the layout.html (and at proper place).

    #{set 'js'}
      <script src="/grid/js/ui/jquery.ui.core.js"></script>
      <script src="/grid/js/ui/jquery.ui.widget.js"></script>
      <script src="/grid/js/jquery.tmpl.js"></script>
      <script src="/grid/js/grid-datamodel/dataitem.js"></script>
      <script src="/grid/js/grid-datamodel/datasource.js"></script>
      <script src="/grid/js/grid-datamodel/datastore.js"></script>
      <script src="/grid/js/grid-datamodel/grid.js"></script>
    #{/set}
    
All of the grid assets are grabbed from /grid/ path which is a route defined by crud-grid module. It takes care of mapping the static resources from the /app/public/javascript/libs folder to the /grid path.

And now the script part where all the heavy crafting of grid initialization is done:

    <script>
      $(document).ready(function() {
        
        var search = $('#crudListSearch'),
        table = $('.grid-table'),
        pagination = $('#crudListPagination'),
        
        // The grid datasource
        datasource = $.ui.datasource({
          // The type of source we're exposing
          type: 'timezones',
          // request parameters to be sent whenever datasource.get occurs
          data: {search: 'français'},

          // remote service url
          source: '/localisedtimezones.json'
        }),
          
        // Now, let's create the grid widget, store its instance for later
        grid = $('.crud-grid').grid({
          // Must match a previously defined datasource
          type: 'timezones',
          
          // Mapping to apply
          columns: ['timeZoneId', 'name', 'language', 'offset']
        }).grid('widget'),
          
          
          // Overide default search behaviour to use our own
        form = search.find('form').bind('submit', function() {
          datasource.get({
            search: $.trim($(this).find('input[name="search"]').val())
          });
          return false;
        });
           
        // Now deals with pagination link interception. 
        pagination.delegate('a', 'click', function(e){
          var link = $(e.target),
          page = link.attr('href').match(/page=(\d+)/)[1];
            
          if(page) {
            datasource.get({page: page});
          }
            
          return false;
        });
          

      });
    </script>
    
And yeah, the CRUD's layout file (app/views/CRUD/layout.html) has been boilerplatized:

    <!doctype html public "✰">

    <!--[if lt IE 7 ]> <html lang="en" class="no-js ie6"> <![endif]-->
    <!--[if IE 7 ]>    <html lang="en" class="no-js ie7"> <![endif]-->
    <!--[if IE 8 ]>    <html lang="en" class="no-js ie8"> <![endif]-->
    <!--[if IE 9 ]>    <html lang="en" class="no-js ie9"> <![endif]-->
    <!--[if (gt IE 9)|!(IE)]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

      <title>#{get 'title' /} - Play!ing with jQuery UI Grid and Ajax datasource</title>

      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="shortcut icon" href="/favicon.ico">
      <link rel="apple-touch-icon" href="/apple-touch-icon.png">

      <link rel="stylesheet" href="/public/stylesheets/main.css?v=2">
      <link rel="stylesheet" type="text/css" media="screen" href="@{'/public/stylesheets/crud.css'}?v=2" />
      <link rel="stylesheet" type="text/css" media="screen" href="/grid/css/themes/base/jquery.ui.all.css?v=2">
      #{get 'css' /}

    </head>

    <body>

      <div id="crud">
        <header class="ui-widget-header">
    			<h1><a href="@{CRUD.index()}">&{'crud.title'}</a></h1>
    			<h2>Play!ing with jQuery UI Grid and Ajax datasource</h2>
          <div id="switcher"></div>
        </header>

        	#{if request.actionMethod != 'index'}
      			<div id="crudBreadcrumb">
      				#{crud.navigation /}
      			</div>
      		#{/if}

      		#{if flash.success}
      			<div class="crudFlash flashSuccess">
      				${flash.success}
      			</div>
      		#{/if}

      		#{if flash.error || error}
      			<div class="crudFlash flashError">
      				${error ?: flash.error}
      			</div>
      		#{/if}



        <div id="crudContent">
    			#{doLayout /}
        </div>

        <footer id="crudFooter" class="ui-widget-header">
    			Generated by the Play CRUD module. <a href="http://www.playframework.org/documentation/1.1/crud">Learn how to customize it
        </footer>
      </div> <!-- end of #container -->


      <script src="//ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js"></script>
      <script>!window.jQuery && document.write(unescape('%3Cscript src="/public/javascripts/libs/jquery-1.5.min.js"%3E%3C/script%3E'))</script>


      <!-- scripts concatenated and minified via ant build script-->
      <script src="/public/javascripts/plugins.js"></script>
      <script src="/public/javascripts/script.js"></script>
      <!-- end concatenated and minified scripts-->

      #{get 'js' /}


      <!--[if lt IE 7 ]>
        <script src="js/libs/dd_belatedpng.js"></script>
        <script> DD_belatedPNG.fix('img, .png_bg'); </script>
      <![endif]-->

      <!-- change the UA-XXXXX-X to be your site's ID -->
      <script>
       var _gaq = [['_setAccount', 'UA-XXXXX-X'], ['_trackPageview']];
       (function(d, t) {
        var g = d.createElement(t),
            s = d.getElementsByTagName(t)[0];
        g.async = true;
        g.src = ('https:' == location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        s.parentNode.insertBefore(g, s);
       })(document, 'script');
      </script>

    </body>
    </html>


Sooooo much better this way ;)