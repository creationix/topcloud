/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery */

(function ($) {
	
	// Prototype for all controllers
	TC.Controller = {
		
		// For local vars specify only value and as
		// For local vars specify model and resource
		// opts.value - The initial value of the variable
		// opts.model - The server side model to bind to
		// opts.resource - the resource on the server side model
		// opts.as - an optional alias for local bindings.	If not specified
		//					 it defaults to opts.resource
		bindData: function (name, opts) {
			var controller, obj;
		
			controller = this;
			obj = {
				bound_variable: name,
				invalidate: function () {
					return controller.invalidate(name);
				},
				get: function (callback) {
					return controller.get(name, callback);
				},
				set: function (value, scope) {
					return controller.set(name, value, scope);
				}
			};
			if (opts.value !== undefined) {
				obj.value = opts.value;
			}
			if (opts.proxy !== undefined) {
				obj.proxy = opts.proxy;
			}
			this[name] = obj;
		},

		// This binds the view data to the controller
		// It loads the components on demand.  Since this is
		// an async operation, a callback can be given that is called when ready.
		bindView: function (data, callback) {
			var controller = this, deps = {}, left = 0;
		
			// This recursive functions traverses the data tree and turns the raw data
			// into live objects.
			function bind_to_controller(component_array, parent) {
				var data = [];

				$.each(component_array, function (i, component) {
					var params, Constructor;

					// Get the appropriate constructor (Button, Dropdown, etc...)
					Constructor = TC.components[component.name];

					// Create a new instance passing in controller and component data
					component = new Constructor(controller, component);

					// Store reference to parent if there is one
					if (parent !== undefined) {
						component.parent = parent;
					}
				
					// Convert bindings to native references
					params = component.params;
					$.each(params, function (i, name) {
						if (i.substr(0, 1) === '@') {
							var key = i.substr(1);
							delete(params[i]);
							if (typeof controller[name] === 'function') {
								params[key] = function () {
									return controller[name](component);
								};
							} else {
								params[key] = controller[name];
							}
						}
					});


					// Call the initializer if there is one
					if (component.initialize) {
						component.initialize();
					}

					// Recursivly bind the children.
					if (component.children) {
						component.children = bind_to_controller(component.children, component);
					}
				
					data.push(component);
				});
				return data;
			}

			// Recursivly determine the needed components.
			function find_deps(component_array) {
				$.each(component_array, function () {
					deps[this.name] = true;
					if (this.children) {
						find_deps(this.children);
					}
				});
			}
			find_deps(data);

			$.each(deps, function (name) {
				left += 1;
			});
			
			$.each(deps, function (name) {
				TC.load_script("TC/components/" + name + ".js", function () {
					left -= 1;
					if (left === 0) {
						// Kick off recursive function for each of the root nodes.
						controller.interface_data = bind_to_controller(data);
						callback();
					}
				});
			});
		},

		invalidate: function (name) {
			if (this[name].proxy === undefined) {
				delete(this[name].value);
			} else {
				this[name].proxy.invalidate();
			}
		},

		// Generic getter function
		get: function (name, callback) {
			var obj = this[name], self = this;
			
			if (obj.proxy === undefined) {
				// if local object return as is
				return obj.value;
			} else {
				// otherwise wrap the proxy
				return obj.proxy.get(function (data) {
					self.notify(name);
					if (callback) {
						callback(data);
					}
				});
			}
		},
	
		// Generic setter function
		set: function (name, value, scope) {
			var obj = this[name];
			
			if (obj.proxy === undefined) {
				// if local object set local value
				obj.value = value;
			} else {
				// otherwise wrap the proxy
				return obj.proxy.set(value);
			}
			this.notify(name, scope);
		},
	
		unlisten: function (name, scope) {
			this.listeners[name] = this.listeners[name].filter(function (listener) {
				return listener.scope !== scope;
			});
		},
	
		// Add a listener to a data bound variable
		listen: function (name, callback, scope) {
			var already = false;
			if (this.listeners === undefined) {
				this.listeners = {};
			}
			if (this.listeners[name] === undefined) {
				this.listeners[name] = [];
			}
			
			$.each(this.listeners[name], function () {
				if (scope === this.scope) {
					already = true;
				}
			});
			if (already) {
				// console.log("Already registered", this.listeners);
				return;
			}
		
			this.listeners[name].push({callback: callback, scope: scope});
			// console.log("New array", this.listeners);
		},
	
		// Notify all event listeners
		notify: function (name, scope) {
			var self = this;
			// console.log("Listeners", this.listeners);
			if (this.listeners && this.listeners[name]) {
				$.each(this.listeners[name], function () {
					if (!scope || this.scope !== scope) { 
						this.callback.call(self, self[name].get());
					}
				});
			}
		},
	
		// Recursivly pre-calculate the width and height of every component since
		// IE6 can't do it on it's own.
		calcSizes: function (dimensions) {
			// Get initial dimensions, defaulting to first node
			dimensions = dimensions || {};
			dimensions.width = dimensions.width || this.interface_data[0].layout.width;
			dimensions.height = dimensions.height || this.interface_data[0].layout.height;
		
			// Recursivly apply dimensions 
			function calc(component, parent_dimensions) {
				var layout = component.layout, width, height;
			
				// Store the parent width and height in the layout
				layout.parent_width = parent_dimensions.width;
				layout.parent_height = parent_dimensions.height;

				if (component.children) {
					// New width is width if specified, or parent_width minux left and right if not.
					if (layout.width !== undefined) {
						width = layout.width;
					} else {
						width = parent_dimensions.width - layout.left - layout.right;
					}
					// Same for height, top, and bottom.
					if (layout.height !== undefined) {
						height = layout.height;
					} else {
						height = parent_dimensions.height - layout.top - layout.bottom;
					}
					// Apply recursivly for children with new parent dimensions
					$.each(component.children, function () {
						calc(this, {width: width, height: height});
					});
				}
			}
		
			// Kick off the recursive function starting at the root nodes of the view.
			$.each(this.interface_data, function () {
				calc(this, dimensions);
			});
		},
	
		// Turns the controller into haml that can be dom built
		render: function (dimensions) {
			var json;
		
			// Precalculate sizes for IE6
			if (!$.support.boxModel) {
				this.calcSizes(dimensions);
			}

			// Kick off recursive call for each root component
			json = [];
			$.each(this.interface_data, function () {
				json.push(this.render());
			});
			return json;
		}
	};
	
}(jQuery));
