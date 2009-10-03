/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery */

(function ($) {

	TC.components.DataTable = function (controller, data) {
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
			columns = params.columns;
			$.each(columns, function (name) {
				widths[name] = widths[name] || 1;
				sum += widths[name];
			});
			$.each(columns, function (name) {
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
			css = TC.parse_layout(layout);
			table_model = params.table_model;
			columns = params.columns;
			var num_rows = table_model.get_num_rows(self);

			function get_table_haml() {
				var checked, headers, rows, index;
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

				function render_row(index) {
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

					cells = [];
					$.each(columns, function (key, name) {
						cells.push(["%td", {css: {width: widths[key]}}, table_model.get_value_at(index, key)]);
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
				}

				headers = [];
				$.each(columns, function (key, name) {
					headers.push(["%th", {css: {width: widths[key]}}, name]);
				});
				if (params.checked) {
					headers = [["%td", ["%input", {checked: check_state, $: {click: [on_toggle_all]}, type: "checkbox", style: "width:16px"}]]].concat(headers);
				}

				rows = [];
				for (index = 0; index < num_rows; index += 1) {
					rows.push(render_row(index));
				}

				return ["%table", {style: "width: 100%;overflow-y:auto;"},
					["%thead.ui-widget-header", ["%tr", headers]],
					["%tbody", rows]
				];
			}

			return [".ui-widget-content", {css: css}, (num_rows === undefined) ? "Loading...": get_table_haml()];
		};

		TC.Component.apply(this, arguments);
	};

}(jQuery));

