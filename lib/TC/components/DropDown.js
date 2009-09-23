// data.params.options - hash of value/name pairs
// data.params.value - currently selected value
TC.components.DropDown = function (controller, data) {
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
};
