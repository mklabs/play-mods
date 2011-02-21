Play! Boilerplate Demo apps
---------------------------

This Play! app uses a custom play module that brings the rock solid default [HTML5 Boilerplate](http://html5boilerplate.com/) into your Play applications.
 

## Example application

First thing thirst, configure the play app to use the boilerplate module (assuming the boilerplate module is located next to the play app).

_**conf/application.conf**_

	# ---- MODULES ----
	module.play-boilerplate=../play-boilerplate
	
Then, import module's route (as they're not loaded automatically):

_**conf/routes**_

	# HTML5 Boilerplate
	*     /	     									module:play-boilerplate

Finally, you'll have to slighly changes your template files to point to the boilerplate layout:

_**app/views/main.html**_ (Usually, your top-level app's layout should be fairly convenient)
	#{extends 'html5boilerplate/layout.html' /}

## html5boilerplate/layout markup

It basically tries to adapt official boilerplate's markup to the play's layout system:

	<!doctype html>  

	<!-- paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/ --> 
	<!--[if lt IE 7 ]> <html lang="en" class="no-js ie6"> <![endif]-->
	<!--[if IE 7 ]>    <html lang="en" class="no-js ie7"> <![endif]-->
	<!--[if IE 8 ]>    <html lang="en" class="no-js ie8"> <![endif]-->
	<!--[if IE 9 ]>    <html lang="en" class="no-js ie9"> <![endif]-->
	<!--[if (gt IE 9)|!(IE)]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
	<head>
	  <meta charset="utf-8">
	
	  <!-- Always force latest IE rendering engine (even in intranet) & Chrome Frame 
	       Remove this if you use the .htaccess -->
	  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	
	  <title>#{get 'title' /} - ${play.configuration.getProperty('application.name')}</title>
	  <meta name="description" content="${play.configuration.getProperty('application.description')}">
	  <meta name="author" content="${play.configuration.getProperty('application.author')}">
	
	  <!--  Mobile viewport optimized: j.mp/bplateviewport -->
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	
	  <!-- Place favicon.ico & apple-touch-icon.png in the root of your domain and delete these references -->
	  <link rel="shortcut icon" href="/boilerplate/favicon.ico">
	  <link rel="apple-touch-icon" href="/boilerplate/apple-touch-icon.png">
	
	  <!-- CSS : implied media="all" -->
	  <link rel="stylesheet" href="/boilerplate/css/style.css?v=2">
	  <link rel="stylesheet" href="@{'/public/stylesheets/main.css'}">
	  #{get 'moreStyles' /}
	
	  <!-- Uncomment if you are specifically targeting less enabled mobile browsers
	  <link rel="stylesheet" media="handheld" href="/boilerplate/css/handheld.css?v=2">  -->
	 
	  <!-- All JavaScript at the bottom, except for Modernizr which enables HTML5 elements & feature detects -->
	  <script src="/boilerplate/js/libs/modernizr-1.6.min.js"></script>
	
	</head>
	
	<body>
	
	  <div id="container">
	    <header>
	    
	    </header>
	
	    <div id="main">
	      #{doLayout /}
	    </div>
	    
	    <footer>
	    
	    </footer>
	  </div> <!--! end of #container -->
	
	
	  <!-- Javascript at the bottom for fast page loading -->
	
	  <!-- Grab Google CDN's jQuery. fall back to local if necessary -->
	  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js"></script>
	  <script>!window.jQuery && document.write(unescape('%3Cscript src="/boilerplate/js/libs/jquery-1.5.0.js"%3E%3C/script%3E'))</script>
	
	  
	  <!-- scripts concatenated and minified via ant build script-->
	  <!-- Play!Boilerplate: you'll probably want to change this to match yours. -->
	  <!-- Play!Boilerplate: plugins.js is where you put all external jQuery plugins,  script is where you put your own code. -->
	  <script src="/boilerplate/js/plugins.js"></script>
	  <script src="/boilerplate/js/script.js"></script>
	  
	  #{get 'moreScripts' /}  
	  <!-- end concatenated and minified scripts-->
	  
	  
	  <!--[if lt IE 7 ]>
	    <script src="/boilerplate/js/libs/dd_belatedpng.js"></script>
	    <script> DD_belatedPNG.fix('img, .png_bg'); //fix any <img> or .png_bg background-images </script>
	  <![endif]-->
	
	  <!-- yui profiler and profileviewer - remove for production -->
	  <script src="/boilerplate/js/profiling/yahoo-profiling.min.js"></script>
	  <script src="/boilerplate/js/profiling/config.js"></script>
	  <!-- end profiling code -->
	
	
	  <!-- asynchronous google analytics: mathiasbynens.be/notes/async-analytics-snippet 
	       change the UA-XXXXX-X to be your site's ID -->
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
	
As you can see, the whole set of static boilerplate's file are made available with the /boilerplate/ path and are properly referenced in the layout's markup. Indeed, the Play! Boilerplate module expose the following routes:
	
It maps the static resources from the support/html5-boilerplate-v0.9.5 to the /boilerplate/ path 

## So, what is html5 boilerplate?

Quoting the [project's readme file](https://github.com/paulirish/html5-boilerplate):

> This is a set of files that a front-end developer can use to get started on a website.

Quoting the [html5boilerplate](http://html5boilerplate.com/)'s website:

> HTML5 Boilerplate is the professional badass's base HTML/CSS/JS template for a fast, robust and future-proof site.

> After more than two years in iterative development, you get the best of the best practices baked in: cross-browser normalization, performance optimizations, even optional features like cross-domain Ajax and Flash. A starter apache .htaccess config file hooks you the eff up with caching rules and preps your site to serve HTML5 video, use @font-face, and get your gzip zipple on.

> Boilerplate is not a framework, nor does it prescribe any philosophy of development, it's just got some tricks to get your project off the ground quickly and right-footed.

Pretty sweet, isn't it?

## Why it is awesome

* Cross-browser compatible (IE6, yeah we got that.)
* HTML5 ready. Use the new tags with certainty.
* Optimal caching and compression rules for grade-A performance
* Best practice site configuration defaults
* Mobile browser optimizations
* Progressive enhancement graceful degradation … yeah yeah we got that
* IE specific classes for maximum cross-browser control
* Handy .no-js and .js classes to style based on capability
* Want to write unit tests but lazy? A full, hooked up test suite is waiting for you.

## Why it is awesome-er

* Javascript profiling…in IE6 and IE7? Sure, no problem.
* Console.log nerfing so you won't break anyone by mistake.
* Never go wrong with your doctype or markup!
* An optimal print stylesheet, performance optimized.
* iOS, Android, Opera Mobile-adaptable markup and CSS skeleton.
* IE6 pngfix baked in.
* .clearfix, .visuallyhidden classes to style things wisely and accessibly.
* .htaccess file that allows proper use of HTML5 features and faster page load
* CDN hosted jQuery with local fallback failsafe.
* Think there's too much? The HTML5 Boilerplate is delete-key friendly. :)

## Why your Play! app needs it

Because the play framework is a fantastic java framework that brings a clean alternatve to heavy enterprise Java stacks. Just let's mix it with the most incredible set of front-end best practices and Optimal caching / compression rules for grade-A performance.

Because we need nothing less than the best... on both sides!

## Area of improvements

* See how we can support the boilerplate's build script (which is HUGE) in a Play! app context.
* Determine where and how users could customize their layout (now the layout folder has built-in dom markup with header, div#main and footer, might need to restrict this to play! apps views which then are decorated with boilerplate's layout).
* Build a set of command line utility to provide the ability to overidde and customize the layout (like it could be done with the crud module and play crud:ov -template)
* Brings to module's scope the full QUnit hooked up test suite (and how it may integrate itself with play testing)

