/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery */

(function ($) {

	// data.params.click - string of method name in controller
	// data.params.icon - jquery-ui icon name
	// data.params.value - text display value on button
	TC.components.Button = function (controller, data) {
		this.get_haml = function () {
			var layout, params, css, icon_css, label_css, haml, value;
		
			layout = this.layout;
			params = this.params;
			css = TC.parse_layout(layout);
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
			
			value = params.value;
			if (value.bound_variable) {
				value = params.value.get();
				controller.listen(params.value.bound_variable, function (value) {
					$("div div", self.element).text(value);
				}, self);
			}
			
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
			haml.push(["%div", {css: label_css}, value]);
			return haml;
		};
		TC.Component.apply(this, arguments);
	};

}(jQuery));
