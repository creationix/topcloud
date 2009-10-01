/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery */

(function ($) {

	// data.params.value - current value
	TC.components.Label = function (controller, data) {
		var self = this;
		this.get_haml = function () {
			var layout, params, css, fill_css, value, props;
		
			layout = this.layout;
			params = this.params;
			css = TC.parse_layout(layout);
			if (!params.html) {
  			css['font-weight'] = 'bold';
			}
			css['line-height'] = layout.height + "px";
			value = params.value;
			if (value.bound_variable) {
				value = params.value.get();
				controller.listen(params.value.bound_variable, function (value) {
				  if (params.html) {
  					$(self.element).html(value);
				  } else {
  					$(self.element).text(value);
				  }
				}, self);

			}
			props = {css: css};
			if (params.html) {
			  props.$ = {'html': [value]};
			  value = "";
			}
			return ["%div", props, value];
		};
		TC.Component.apply(this, arguments);
	};

}(jQuery));
