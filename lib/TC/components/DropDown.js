/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery */

(function ($) {

	// data.params.options - hash of value/name pairs
	// data.params.value - currently selected value
	TC.components.DropDown = function (controller, data) {
		var self = this;
		this.get_haml = function () {
			var layout, params, options, css, value, props, haml;
		
			layout = this.layout;
			params = this.params;
			css = TC.parse_layout(layout);
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
			$.each(options, function (key, label) {
				haml[2].push(["%option", {value: key, selected: value === key}, label]);
			});

			return haml;
		};
		TC.Component.apply(this, arguments);
	};

}(jQuery));