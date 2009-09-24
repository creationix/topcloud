/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals jQuery, window */

// TopCloud main namespace
var TC;
(function ($) {

	TC = {

		// Prototype for all controllers will be defined here
		Controller: {},

		// Super constructor for all html components
		Component: function () {},

		// All components from the subfolder are stored in the namespace here.
		components: {},

		render_interface: function (url) {
			var path, interface_url, controller, interface_source;
			js_done = false;
			interface_done = false;
			path = url.match(/((?:[A-Z][a-zA-Z0-9_]*)(?:\/[A-Z][a-zA-Z0-9_]*)*)\.js$/)[1].split('/');
			interface_url = url.replace(/\.js$/, '.tci');
			
			// When both the interface_data and the controller are loaded, then combine them and render
			// the interface.
			function check_done() {
				if (controller === undefined || interface_source === undefined) {
					return;
				}
				controller.bindView(TC.Compiler(interface_source));
				console.log("interface_data", controller.interface_data);
				$('body').haml(controller.render());
			}
			
			// Load the controller as a script
			$.getScript(url, function () {
				// Traverse the namespace to the controller
				var root = window;
				$.each(path, function () {
					root = root[this];
				});
				controller = root;
				check_done();
			});

			// Load the interface and parse it
			$.get(interface_url, {}, function (data) {
				interface_source = data;
				check_done();
			}, 'text');

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
