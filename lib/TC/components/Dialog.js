/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery */

(function ($) {

	// data.params.* - Any jQuery-UI Dialog options
	TC.components.Dialog = function (controller, data) {
		var self = this;
	
		// Handy helper to close a dialog
		this.close = function () {
			this.element.dialog('close');
		};
	
		this.get_haml = function () {
			var layout, params, opts;

			layout = this.layout;
			params = this.params;
			opts = {
				bgiframe: true,
				modal: true,
				close: function () {
				
					$(this).remove();
					if (params.close) {
						params.close.apply(this, arguments);
					}
				}
			};
		
			// Since dialogs can't be resizable in IE6, we'll just redraw the window on resize stop
			if (!$.support.boxModel && params.resizable) {
				opts.resizeStop = function (event, ui) {
					layout.width = ui.size.width;
					layout.height = ui.size.height;
					controller.calcSizes(ui.size);
					self.update();
				};
			}
		
			if (layout.width) {
				opts.width = layout.width - 4;
			}
			if (layout.width) {
				opts.height = layout.height + 34 - 4;
			}

			// Passthough jQuery dialog options
			$.each(params, function (key, value) {
				if (value.bound_variable) {
  				value = value.get();
  			}
				opts[key] = opts[key] || value;
			});
		
			return ["%div", {$: {dialog: [opts]}},
				["%div", {css: {
					position: "absolute",
					top: 34 + "px",
					left: 0,
					bottom: 0,
					right: 0
				}}, self.render_children()]
			];
		};
		TC.Component.apply(this, arguments);
	};

}(jQuery));