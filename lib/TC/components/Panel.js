/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery */

(function ($) {

	// data.params.* - Any jQuery-UI Dialog options
	TC.components.Panel = function (controller, data) {
		this.get_haml = function () {
			var layout, params, css, border_width;
		
			layout = this.layout;
			params = this.params;
			border_width = [];
			css = TC.parse_layout(layout);
			if (params.borderTop === undefined) {
				border_width.push('0');
			} else {
				border_width.push(params.borderTop + 'px');
			}
			if (params.borderRight === undefined) {
				border_width.push('0');
			} else {
				border_width.push(params.borderRight + 'px');
			}
			if (params.borderBottom === undefined) {
				border_width.push('0');
			} else {
				border_width.push(params.borderBottom + 'px');
			}
			if (params.borderLeft === undefined) {
				border_width.push('0');
			} else {
				border_width.push(params.borderLeft + 'px');
			}
			css['border-width'] = border_width.join(" ");
			if (params.background !== undefined) {
				css.background = params.background;
			}
			
			return [".ui-widget-content", {css: css}, this.render_children()];
		};
		TC.Component.apply(this, arguments);
	};

}(jQuery));
