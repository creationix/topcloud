// Parent constructor for all html components
TC.Component = function (controller, data) {
	Util.mixin(this, data); 
	var placeholder, self = this;
	
	// This is called by the controller and passes the work on to the get_haml function
	// that's defined in the actual constructor implementation
	this.render = function (contents) {
		
		// Use a placeholder so we can redraw the component
		placeholder = $.haml.placeholder(function () {
			var haml = self.get_haml();
			return haml;
		});
		this.element = placeholder.inject();
		return this.element;
	};
	
	this.render_children = function () {
		if (this.children) {
			return Util.map(this.children, function (child) {
				return child.render();
			});
		}
	};
	
	this.update = function () {
		self.element = placeholder.update();
		return self.element;
	};
};
