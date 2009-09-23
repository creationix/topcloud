// data.params.value - current value
TC.components.Label = function (controller, data) {
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
};
