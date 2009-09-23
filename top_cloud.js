/*globals jQuery */

// TopCloud View System
var TC;
// window.is_ie6 = true;
(function ($) {

	// Utility function used to generate css for absolute positioning
	function parse_layout(layout) {
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
			if (window.is_ie6) {
				if (layout.left !== undefined) {
					css.width = (parent_width - layout.right - layout.left) + "px";
				} else {
					if (layout.width !== undefined) {
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
				if (layout.top !== undefined) {
					css.height = (parent_height - layout.bottom - layout.top) + "px";
				} else {
					if (layout.height !== undefined) {
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
	
	var remote_cache = {};
	
	TC = {
		


		components: {
			
			// data.params.click - string of method name in controller
			// data.params.icon - jquery-ui icon name
			// data.params.value - text display value on button
			Button: function (controller, data) {
				this.get_haml = function () {
					var layout, params, css, icon_css, label_css, haml;
					
					layout = this.layout;
					params = this.params;
					css = parse_layout(layout);
					css.width = (layout.width - 2) + "px";
					css.height = (layout.height - 2) + "px";
					css.cursor = "pointer";
					icon_css = {
						position: "absolute",
						left: "3px",
						top: ((layout.height - 18) / 2) + "px"
					};
					label_css = {
						position: "absolute",
						left: (params.icon ? 16 : 0) + "px",
						"text-align": "center",
						width: (layout.width - (params.icon ? 19 : 2)) + "px",
						top: "0",
						'line-height': (layout.height - 1) + "px"
					};
				
					haml = [".ui-state-default ui-corner-all", {
							css: css,
							$: {
								click: [params.click],
								hover: [
									function () {
										$(this).addClass('ui-state-hover');
									},	function () {
										$(this).removeClass('ui-state-hover');
									}
								]
							}
						}
					];
					if (params.icon) {
						haml.push([".ui-icon.ui-icon-" + params.icon, {css: icon_css}]);
					}
					haml.push(["%div", {css: label_css}, params.value]);
					return haml;
				};
				TC.Component.apply(this, arguments);
			},
			
			// data.params.* - Any jQuery-UI Dialog options
			Dialog: function (controller, data) {
				var self = this;
				
				// Handy helper to close a dialog
				this.close = function () {
					this.element.dialog('close');
				};
				
				this.get_haml = function () {
					var layout, params, opts;

					layout = this.layout;
					params = this.params;
					opts = {
						bgiframe: true,
						modal: true,
						close: function () {
							
							$(this).remove();
							if (params.close) {
								params.close.apply(this, arguments);
							}
						}
					};
					
					// Since dialogs can't be resizable in IE6, we'll just redraw the window on resize stop
					if (window.is_ie6 && params.resizable) {
						opts.resizeStop = function (event, ui) {
							layout.width = ui.size.width;
							layout.height = ui.size.height;
							controller.calcSizes(ui.size);
							self.update();
						};
					}
					
					if (layout.width) {
						opts.width = layout.width - 4;
					}
					if (layout.width) {
						opts.height = layout.height + 29 - 4;
					}

					// Passthough jQuery dialog options
					Util.each_pair(params, function (key, value) {
						opts[key] = opts[key] || value;
					});
					
					return ["%div", {$: {dialog: [opts]}},
						["%div", {css: {
							position: "absolute",
							top: 29 + "px",
							left: 0,
							bottom: 0,
							right: 0
						}}, self.render_children()]
					];
				};
				TC.Component.apply(this, arguments);
			},
			
			// data.params.options - hash of value/name pairs
			// data.params.value - currently selected value
			DropDown: function (controller, data) {
				var self = this;
				this.get_haml = function () {
					var layout, params, options, css, value, props, haml;
					
					layout = this.layout;
					params = this.params;
					css = parse_layout(layout);
					value = params.value;
					props = { css: {width: "100%", height: "100%"}};
					if (value.bound_variable) {
						value = params.value.get();
						props.$ = {change: [function () { 
							params.value.set(this.value, self);
						}]};
						controller.listen(params.value.bound_variable, function (new_value) {
							$("select", self.element).val(new_value);
						}, self);
					}
					options = params.options;
					if (options.bound_variable) {
						options = params.options.get();
						controller.listen(params.options.bound_variable, function (new_value) {
							controller.unlisten(params.options.bound_variable, self);
							self.update();
						}, self);
					}
					haml = ["%div", {css: css},
						["%select.ui-widget-content ui-corner-all", props]
					];
					// Put in placeholder if the current value isn't in the list
					if (options[value] === undefined) {
						haml[2].push(["%option"]);
					}
					// Add in the rest of the options.
					haml[2].push(
						Util.map_pairs(options, function (key, label) {
							return ["%option", {value: key, selected: value === key}, label];
						}));
					return haml;
				};
				TC.Component.apply(this, arguments);
			},

			// data.params.value - current value
			Label: function (controller, data) {
				var self = this;
				this.get_haml = function () {
					var layout, params, css, fill_css, value, props;
					
					layout = this.layout;
					params = this.params;
					css = parse_layout(layout);
					css['font-weight'] = 'bold';
					css['line-height'] = layout.height + "px";
					value = params.value;
					if (value.bound_variable) {
						value = params.value.get();
						controller.listen(params.value.bound_variable, function (value) {
							$(self.element).html(value);
						}, self);

					}
					return ["%div", {css: css}, value];
				};
				TC.Component.apply(this, arguments);
			},
			
			// data.params.value - current value
			TextEntry: function (controller, data) {
				var self = this;
				this.get_haml = function () {
					var layout, params, css, fill_css, value, props, form;
					
					layout = this.layout;
					params = this.params;
					css = parse_layout(layout);
					fill_css = {
						position: "absolute",
						left: 0,
						top: 0,
						right: 0,
						bottom: 0
					};
					value = params.value;
					props = {
						css: {width: "100%", height: "100%", border: 0, margin: 0, padding: 0, "line-height": "18px"}
					};
					if (value.bound_variable) {
						value = params.value.get();
						props.$ = {
							change: [function () { 
								params.value.set(this.value, self);
							}],
							keyup: [function () { 
								params.value.set(this.value, self);
							}]
						};
						controller.listen(params.value.bound_variable, function (value) {
							if (params.multiline) {
								$("textarea", self.element).val(value);
							} else {
								$("input", self.element).val(value);
							}
						}, self);

					}
					
					if (params.multiline) {
						form = ["%textarea", props, value];
					} else {
						props.value = value;
						form = ["%input", props];
					}
					return ["%div", {css: css}, [".ui-widget-content ui-corner-all", {css: fill_css}, form]];
				};
				TC.Component.apply(this, arguments);
			},
			
			// TODO: document
			// see contact_management.browse_groups for now
			DataTable: function (controller, data) {
				var self, layout, params, css, table_model, columns, check_state, widths, sum;
				self = this;
				
				this.initialize = function () {
					check_state = false;
					params = this.params;
					if (params.observe) {
						controller.listen(params.observe.bound_variable, function (value) {
							params.on_observe(self, value);
						}, self);
					}
					widths = params.widths || {};
					sum = 0;
					Util.map_pairs(columns, function (name) {
						widths[name] = widths[name] || 1;
						sum += widths[name];
					});
					Util.map_pairs(columns, function (name) {
						widths[name] = Math.floor(100 * widths[name] / sum) + "%";
					});

					if (params.checked) {
						controller.listen(params.checked.bound_variable, function (value) {
							self.update();
						}, self);
					}

				};

				this.get_haml = function () {
					layout = this.layout;
					css = parse_layout(layout);
					table_model = params.table_model;
					columns = params.columns;
					var num_rows = table_model.get_num_rows(self);

					function get_table_haml() {
						var checked, headers;
						if (params.checked) {
							checked = params.checked.get();
						}

						css.overflow = "auto";
						function on_toggle_all(ev) {
							var id, index;
							check_state = !check_state;

							// Update the closure variable checked
							for (index = 0; index < num_rows; index += 1) {
								id = table_model.get_value_at(index, "id");
								if (check_state) {
									checked[id] = true;
								} else {
									delete(checked[id]);
								}
							}

							// Update the state of all checkboxes in the dom too
							$(':checkbox', $(this).closest('table')).attr('checked', check_state);
							params.checked.set(checked, self);
						}


						headers = Util.map_pairs(columns, function (key, name) {
							return ["%th", {css: {width: widths[key]}}, name];
						});
						if (params.checked) {
							headers = [["%td", ["%input", {checked: check_state, $: {click: [on_toggle_all]}, type: "checkbox", style: "width:16px"}]]].concat(headers);
						}
						return ["%table.tc-datatable",
							["%thead.ui-widget-header", ["%tr", headers]],
							["%tbody", Util.map(Util.range(num_rows), function (index) {
								var id, cells, hover, events;

								function on_click(ev) {
									var check_state = !checked[id];
									if (check_state) {
										checked[id] = true;
									} else {
										delete(checked[id]);
									}
									$(':checkbox', this).attr('checked', check_state);
									params.checked.set(checked, self);
								}

								id = table_model.get_value_at(index, "id");

								cells = Util.map_pairs(columns, function (key, name) {
									return ["%td", {css: {width: widths[key]}}, table_model.get_value_at(index, key)];
								});

								if (params.checked) {
									cells = [["%td", ["%input", {type: "checkbox", checked: checked[id], style: "width:16px"}]]].concat(cells);
								}

								hover = [
									function () {
										$(this).addClass('ui-state-hover');
									}, 
									function () {
										$(this).removeClass('ui-state-hover');
									}
								];
								events = {hover: hover};
								if (params.checked) {
									events.click = [on_click];
								}
								return ["%tr", {$: events}, cells];
							})]
						];
					}

					return [".ui-widget-content", {css: css}, (num_rows === undefined) ? "Loading...": get_table_haml()];
				};

				TC.Component.apply(this, arguments);
			},
			
			Toolbar: function (controller, data) {
				this.get_haml = function () {
					var layout, params, css, self;
					
					self = this;
					layout = self.layout;
					params = self.params;
					css = parse_layout(layout);
					css['border-width'] = '1px 0 0 0';
					css.background = 'none';
					return [".ui-widget-content.ui-corner-bottom", {css: css}, self.render_children()];
				};
				TC.Component.apply(this, arguments);
			}
		}
	};
}(jQuery));
