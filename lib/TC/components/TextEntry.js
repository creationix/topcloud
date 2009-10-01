/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery */

(function ($) {

	// data.params.value - current value
	TC.components.TextEntry = function (controller, data) {
		var self = this;
		this.get_haml = function () {
			var layout, params, css, fill_css, value, props, form;
		
			layout = this.layout;
			params = this.params;
			css = TC.parse_layout(layout);
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
			
			if (value === undefined) {
				value = "Loading...";
			}
		
			if (params.multiline) {
				form = ["%textarea.ui-corner-all", props, value];
			} else {
				props.value = value;
				form = ["%input.ui-corner-all", props];
			}
			return ["%div", {css: css}, [".ui-widget-content ui-corner-all", {css: fill_css}, form]];
		};
		TC.Component.apply(this, arguments);
	};

}(jQuery));