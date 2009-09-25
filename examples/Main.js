/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery, Main */

MainController = function (params) {
	
	this.code_samples = function (button) {
		TC.render_interface("CodeSamples.js");
	};

	this.bind_sample = function (button) {
		TC.render_interface("BindSample.js");
	};

}
MainController.prototype = TC.Controller;
