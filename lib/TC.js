/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals jQuery, window */

// TopCloud main namespace
var TC;
(function ($) {
	
	var loaded_urls = {};

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
            cache : true
        });
			} else {
				callback();
			}
		},
		
		set_path: function (path) {
			this.LIB_PATH = path;
		},
		
		initialize: function (callback) {
			var left = 3
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

		// Loads an interface and dom builds it onto the given selector
		// the selector defaults to 'body' if not specified.
		render_interface: function (url, selector) {
			if (!this.initialized) {
				this.initialize(function () {
					TC.render_interface(url, selector);
				})
				return;
			}
			var path, interface_url, controller, interface_source, root;
			js_done = false;
			interface_done = false;
			path = url.match(/((?:[A-Z][a-zA-Z0-9_]*)(?:\/[A-Z][a-zA-Z0-9_]*)*)\.js$/)[1].split('/');
			interface_url = url.replace(/\.js$/, '.tci');
			
			// create the namespaces if they do not exist
			root = window;
			$.each(path, function () {
				if (root[this] === undefined) {
					root[this] = {};
				}
				root = root[this];
			});
			
			
			function render() {
				if (selector === undefined) {
					selector = 'body';
				}
				$(selector).haml(controller.render());
			}
			
			function find_controller() {
				// Traverse the namespace to the controller
				var root = window;
				$.each(path, function () {
					root = root[this];
				});
				controller = root;
			}
			
			// Check to see if we need to load the remote interface or not.
			if (loaded_urls[url] === undefined) {
				loaded_urls[url] = true;

				// When both the interface_data and the controller are loaded, then combine them and render
				// the interface.
				function check_done() {
					if (controller === undefined || interface_source === undefined) {
						return;
					}
					controller.bindView(TC.Compiler(interface_source), render);
				}

				// Load the controller from the server
        $.ajax({
            type: "GET",
            url: url,
            success: function () {
							find_controller();
							check_done();
						},
            dataType: "script",
            cache : true
        });

				// Load the interface and parse it
				$.get(interface_url, {}, function (data) {
					interface_source = data;
					check_done();
				}, 'text');

			} else {
				// If it's already loaded, then finish right away.
				find_controller();
				render();
			}

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
