/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery */

(function ($) {

	TC.components.Container = function (controller, data) {
		this.get_haml = function () {
			var layout, params, css, self;
		
			self = this;
			layout = self.layout;
			params = self.params;
			css = TC.parse_layout(layout);
			css['border-width'] = '1px 0 0 0';
			css.background = 'none';
			return [".ui-widget-content.ui-corner-bottom", {css: css}, self.render_children()];
		};
		TC.Component.apply(this, arguments);
	};

}(jQuery));