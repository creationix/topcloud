/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals jQuery, window */

// TopCloud main namespace
var TC;
(function ($) {
	
	var loaded_urls = {}, interface_source_cache = {}, constructors = {};
	
	// Loads a controller and view file, the view data is stored in a cache
	// the callback is called with the view data when ready
	// A second call to this function for the same url will return the data
	// right away.
	function load_controller(url, callback) {
		var controller_done, interface_source;
		
		// When both the interface_data and the controller are loaded, then combine them and render
		// the interface.
		function check_done() {
			if (!controller_done || interface_source === undefined) {
				return;
			}
			callback(interface_source);
		}

		// Check to see if we need to load the remote interface or not.
		if (loaded_urls[url] === undefined) {
			loaded_urls[url] = true;

			// Load the controller from the server
			$.ajax({
				type: "GET",
				url: url,
				success: function () {
					controller_done = true;
					check_done();
				},
				dataType: "script",
				cache : false
			});

			// Load the interface and parse it
			$.ajax({
				type: "GET",
				url: url.replace(/\.js$/, '.tci'),
				success: function (data) {
					interface_source_cache[url] = data;
					interface_source = data;
					check_done();
				},
				dataType: "text",
				cache: false
			});
		} else {
			interface_source = interface_source_cache[url];
			controller_done = true;
			check_done();
		}
	}

	// Loads an interface and dom builds it onto the given jQuery set
	// the selector defaults to 'body' if not specified.
	function render_interface(url, parent, parameters) {
		// Bootstrap the rest of the TC framework if this is the first call to render_interface
		if (!TC.initialized) {
			TC.initialize(function () {
				render_interface(url, parent, parameters);
			});
			return;
		}

		// Add the user path prefix if it's specified in the config.
		if (TC.USER_PATH !== undefined) {
			url = TC.USER_PATH + url;
		}
		
		load_controller(url, function (interface_source) {
			var path, root, controller, Constructor, wrapper, i, l;

			// Build an array path to the controller in the namespace
			path = url.match(/((?:[A-Z][a-zA-Z0-9_]*)(?:\/[A-Z][a-zA-Z0-9_]*)*)\.js$/)[1].split('/');

			root = window;
			for (i = 0, l = path.length - 1; i < l; i += 1) {
				// Build missing namespace holders
				if (root[path[i]] === undefined) {
					root[path[i]] = {};
				}
				root = root[path[i]];
			}
			// Get the constructor for the controller.
			Constructor = constructors[path.join('.')];
			// Create a new instance of the controller.
			
			wrapper = function () {
				Constructor.apply(this, parameters);
			};
			wrapper.prototype = Constructor.prototype;
			controller = new wrapper();
			// Mount it in the proper place in the namespace.
			root[path[l]] = controller;
			
			controller.bindView(TC.Compiler(interface_source), function () {
				parent.haml(controller.render());
				if (controller.onload) {
				  controller.onload();
				}
			});
			
		});
		
	}

	
	$.fn.topcloud = function (url/*, param1, param2...*/) {
		return render_interface(url, this, Array.prototype.slice.call(arguments, 1));
	};
	
	TC = {
		
		load_script: function (url, callback) {
			if (loaded_urls[url] === undefined) {
				$.ajax({
					type: "GET",
					url: this.LIB_PATH + url,
					success: function () {
						loaded_urls[url] = true;
						callback();
					},
					dataType: "script",
					cache : false
				});
			} else {
				callback();
			}
		},
		
		set_path: function (path) {
			this.LIB_PATH = path;
		},
		
		set_user_path: function (path) {
			this.USER_PATH = path;
		},
		
		initialize: function (callback) {
			var left = 3;
			function check_done() {
				left -= 1;
				if (left === 0) {
					TC.initialized = true;
					callback();
				}
			}
			TC.load_script("TC/Component.js", check_done);
			TC.load_script("TC/Controller.js", check_done);
			TC.load_script("TC/Compiler.js", check_done);
		},
		
		// Prototype for all controllers will be defined here
		Controller: {},

		// Super constructor for all html components
		Component: function () {},

		// All components from the subfolder are stored in the namespace here.
		components: {},
		
		defineController: function (name, Constructor) {
			Constructor.prototype = TC.Controller;
			constructors[name] = Constructor;
		},
		
		render_interface: function (url/*, param1, param2...*/) {
			return render_interface(url, $('body'), Array.prototype.slice.call(arguments, 1));
		},

		// Utility function used to generate css for absolute positioning
		parse_layout: function (layout) {
			var parent_width = layout.parent_width,
					parent_height = layout.parent_height,
					css = { display: "inline",	position: "absolute" };
			if (layout.left !== undefined) {
				css.left = layout.left + "px";
			}
			if (layout.top !== undefined) {
				css.top = layout.top + "px";
			}
			if (layout.right !== undefined) {
				if ($.support.boxModel) {
					css.right = layout.right + "px";
				} else {
					if (layout.left !== undefined) {
						css.width = (parent_width - layout.right - layout.left) + "px";
					} else {
						if (layout.width !== undefined) {
							css.left = (parent_width - layout.right - layout.width) + "px";
						}
					}
				}
			}
			if (layout.bottom !== undefined) {
				// IE6 doesn't support "conflicting" sides.
				if ($.support.boxModel) {
					css.bottom = layout.bottom + "px";
				} else {
					if (layout.top !== undefined) {
						css.height = (parent_height - layout.bottom - layout.top) + "px";
					} else {
						if (layout.height !== undefined) {
							css.top = (parent_height - layout.bottom - layout.height) + "px";
						}
					}
				}
			}
			if (layout.height !== undefined) {
				css.height = layout.height + "px";
			}
			if (layout.width !== undefined) {
				css.width = layout.width + "px";
			}
			return css;
		}

	};

	// Add in Object.create if we don't have it already
	if (typeof Object.create !== 'function') {
		Object.create = function (o) {
			function F() {}
			F.prototype = o;
			return new F();
		};
	}
	
}(jQuery));
