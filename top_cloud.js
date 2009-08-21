// requires common_widgets

// TopCloud View System
var TC;

(function () {

	var listeners = {}, $ = jQuery;
	
	function parse_layout(layout) {
		var parent_width = layout.parent_width;
		var parent_height = layout.parent_height;
		var css = { display: "inline",  position: "absolute" };
		if (layout.left !== undefined) {
			css.left = layout.left + "px";
		}
		if (layout.top !== undefined) {
			css.top = layout.top + "px";
		}
		if (layout.right !== undefined) {
			if (window.is_ie6) {
				if (layout.left) {
					css.width = (parent_width - layout.right - layout.left) + "px";
				} else {
					if (layout.width) {
						css.left = (parent_width - layout.right - layout.width) + "px";
					}
				}
			} else {
				css.right = layout.right + "px";
			}
		}
		if (layout.bottom !== undefined) {
			// IE6 doesn't support "conflicting" sides.
			if (window.is_ie6) {
				if (layout.top) {
					css.height = (parent_height - layout.bottom - layout.top) + "px";
				} else {
					if (layout.height) {
						css.top = (parent_height - layout.bottom - layout.height) + "px";
					}
				}
			} else {
				css.bottom = layout.bottom + "px";
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
	
	TC = {
		
		// This is called by the View.php class when embedding interface files in
		// the autogenerated js file.
		registerInterface: function (options, data) {
			window[options.folder][options.name].prototype.interface_data = data;
		},
		
		loadDialog: function (controller) {
			$('body').haml((new controller()).render());
		},
		
		Controller: function () {
			var self = this;
			
			// opts.model - The server side model to bind to
			// opts.resource - the resource on the server side model
			// opts.as - an optional alias for local bindings.  If not specified
			//           it defaults to opts.resource
			this.bindData = function (opts) {
				var model_listeners;

				opts.as = opts.as || opts.resource;
				
				// Create hash for the model if there isn't one yet.
				if (!listeners[opts.model]) {
					listeners[opts.model] = {};
				}
				model_listeners = listeners[opts.model];
				
				// Create an array for the resoure if there isn't one yet.
				if (!model_listeners[opts.resource]) {
					model_listeners[opts.resource] = [];
				}
				
				model_listeners[opts.resource].push(function() {
					self.redraw(opts.as);
				});
			};

			// Turns the controller into haml that can be dom built
			this.render = function (dimensions) {
				dimensions = dimensions || {};
				dimensions.width = dimensions.width || this.interface_data[0].layout.width;
				dimensions.height = dimensions.height || this.interface_data[0].layout.height;
				var controller = this;
				function render_component(component, dimensions) {
					var layout = component.layout || {};
					if (isTypeOf(component, 'Array')) {
						return Util.map(component, function (component) { return render_component(component, dimensions); });
					}
					var contents = component.children ? Util.map(component.children, function (child) {
						var width, height;
						if (layout.width !== undefined) {
							width = layout.width;
						} else {
							width = dimensions.width - layout.left - layout.right;
						}
						if (layout.height !== undefined) {
							height = layout.height;
						} else {
							height = dimensions.height - layout.top - layout.bottom;
						}
						return render_component(child, {width: width, height: height});
					}) : [];
					var Constructor = TC.components[component.name];
					layout.parent_width = dimensions.width || layout.width;
					layout.parent_height = dimensions.height || layout.height;
					var com = new Constructor(controller, component.params || {}, component.layout, contents);
					var haml = com.render();
					if (component.id) {
						if (!controller.components) {
							controller.components = {};
						}
						controller.components[component.id] = haml;
					}
					return haml;
				}
				
				return render_component(this.interface_data, dimensions);
			};
			
		},

		Component: function (controller, options, layout, content) {
			// Convert bindings to native references
			for (var i in options) {
				if (options.hasOwnProperty(i) && i[0] === '@') {
					var name = options[i];
					delete(options[i]);
					if (typeof controller[name] === 'function') {
						options[i.substr(1)] = function () { return controller[name](); };
					} else {
						options[i.substr(1)] = controller[name];
					}
				}
			}
			var placeholder, self = this;
			if (!this.get_haml) {
				this.get_haml = function () { return [".ui-state-error", "TODO: Implement me!"]; };
			}
			this.render = function (contents) {
				placeholder = new $.haml.Placeholder(function() {
					var haml = self.get_haml();
					return haml;
				});
				return placeholder.inject();
			};
				
			this.update = function () { return placeholder.update(); };
		},

		components: {
			
			// options.click - string of method name in controller
			// options.icon - jquery-ui icon name
			// options.value - text display value on button
			Button: function (controller, options, layout) {
				var css = parse_layout(layout);
				css.cursor = "pointer";
				var icon_css = {
					position: "absolute",
					left: "3px",
					top: ((layout.height - 16) / 2) + "px"
				};
				var label_css = {
					position: "absolute",
					left: (options.icon ? 16 : 0) + "px",
					"text-align": "center",
					right: "0",
					top: "0",
					'line-height': css.height
				};
				if (window.is_ie6) {
					label_css.left = (options.icon ? 20 : 4) + "px";
				}
				
				this.get_haml = function () {
					var haml = [".ui-state-default ui-corner-all", {
							css: css,
							$: {
								click: [options.click],
								hover: [
									function () {
										$(this).addClass('ui-state-hover');
									}, 	function () {
										$(this).removeClass('ui-state-hover');
									}
								]
							}
						}
					];
					if (options.icon) {
						haml.push([".ui-icon.ui-icon-" + options.icon, {css: icon_css}]);
					}
					haml.push(["%div", {css: label_css}, options.value]);
					return haml;
				};
				TC.Component.apply(this, arguments);
			},
			
			// options.* - Any jQuery-UI Dialog options
			Dialog: function (controller, options, layout, content) {
				this.get_haml = function () {
					var opts = {
						bgiframe: true,
						modal: true,
						close: function () {
							$(this).remove();
							if (options.close) {
								options.close.apply(this, arguments);
							}
						}
					};
					if (window.is_ie6) {
						options.resizable = false;
					}
					if (layout.width) {
						opts.width = layout.width;
					}
					if (layout.width) {
						opts.height = layout.height + 29;
					}

					// Passthough jQuery dialog options
					for (var key in options) {
						if (options.hasOwnProperty(key) && !(opts[key])) {
							opts[key] = options[key];
						}
					}
					return ["%div", {$: {dialog: [opts]}},
						["%div", {css: {
							position: "absolute",
							top: 29 + "px",
							left: 0,
							bottom: 0,
							right: 0
						}}, content]
					];
				};
				TC.Component.apply(this, arguments);
			},
			
			// options.options - hash of value/name pairs
			// options.value - currently selected value
			DropDown: function (controller, options, layout) {
				var css = parse_layout(layout);
				this.get_haml = function () {
					return ["%div", {css: css},
						["%select.ui-widget-content ui-corner-all", { css:{width:"100%",height:"100%"}},
							["%option"],
							Util.map_pairs(options.options, function (value, label) {
								return ["%option", {value: value, selected: options.value === value}, label];
							})
						]
					];
				};
				TC.Component.apply(this, arguments);
			},
			
			DataTable: function (controller, params, layout) {
				var css = parse_layout(layout);
				css['background-color'] = '#888';
				this.get_haml = function () {
					return ["%div", {css: css}, "Implement me!"];
				};
				TC.Component.apply(this, arguments);
			},
			
			Toolbar: function (controller, params, layout, content) {
				var css = parse_layout(layout);
				css['border-width'] = '1px 0 0 0';
				this.get_haml = function () {
					return [".ui-widget-content", {css: css}, content];
				};
				TC.Component.apply(this, arguments);
			}
		}
	};
}());
