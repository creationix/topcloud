TC.components.Toolbar = function (controller, data) {
	this.get_haml = function () {
		var layout, params, css, self;
		
		self = this;
		layout = self.layout;
		params = self.params;
		css = parse_layout(layout);
		css['border-width'] = '1px 0 0 0';
		css.background = 'none';
		return [".ui-widget-content.ui-corner-bottom", {css: css}, self.render_children()];
	};
	TC.Component.apply(this, arguments);
};
