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
		if (window.is_ie6 && params.resizable) {
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
			opts.height = layout.height + 29 - 4;
		}

		// Passthough jQuery dialog options
		Util.each_pair(params, function (key, value) {
			opts[key] = opts[key] || value;
		});
		
		return ["%div", {$: {dialog: [opts]}},
			["%div", {css: {
				position: "absolute",
				top: 29 + "px",
				left: 0,
				bottom: 0,
				right: 0
			}}, self.render_children()]
		];
	};
	TC.Component.apply(this, arguments);
};
