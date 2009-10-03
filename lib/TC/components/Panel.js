/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery */

(function ($) {

	// data.params.* - Any jQuery-UI Dialog options
	TC.components.Panel = function (controller, data) {
		this.get_haml = function () {
			var layout, params, css, border_width, value, props, self = this;
		
			layout = this.layout;
			params = this.params;
			border_width = [];
			css = TC.parse_layout(layout);
			if (params.borderTop === undefined && params.borderAll === undefined) {
				border_width.push('0');
			} else {
				border_width.push((params.borderTop || params.borderAll) + 'px');
			}
			if (params.borderRight === undefined && params.borderAll === undefined) {
				border_width.push('0');
			} else {
				border_width.push((params.borderRight || params.borderAll) + 'px');
			}
			if (params.borderBottom === undefined && params.borderAll === undefined) {
				border_width.push('0');
			} else {
				border_width.push((params.borderBottom || params.borderAll) + 'px');
			}
			if (params.borderLeft === undefined && params.borderAll === undefined) {
				border_width.push('0');
			} else {
				border_width.push((params.borderLeft || params.borderAll) + 'px');
			}
			css['border-width'] = border_width.join(" ");
			if (params.background === undefined) {
				css.background = 'none';
			} else {
				css.background = params.background;
			}
			if (params.scrollY !== undefined) {
				css["overflow-y"] = params.scrollY === 'bottom' ? 'auto' : params.scrollY;
			}
			if (params.scrollX !== undefined) {
				css["overflow-x"] = params.scrollX;
			}
			if (params.scroll !== undefined) {
				css.overflow = params.scroll;
			}
			if (params.padding !== undefined) {
				css.padding = params.padding + "px";
			}
			value = params.value;
			if (value.bound_variable) {
				value = params.value.get();
				controller.listen(params.value.bound_variable, function (value) {
					self.element.empty();
					self.element.haml(value);
					if (params.scrollY === 'bottom') {
						self.element.scrollTop(1000000);
					}
				}, self);
			}
			props = {css: css};
			if (value === undefined) {
				value = this.render_children();
			}
			return [".ui-widget-content", props, value];
		};
		TC.Component.apply(this, arguments);
	};

}(jQuery));
