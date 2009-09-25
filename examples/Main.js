/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery, Main */

(function ($) {
	
	Main = Object.create(TC.Controller);
	
	Main.code_samples = function (button) {
		TC.render_interface("CodeSamples.js");
	};

	Main.bind_sample = function (button) {
		TC.render_interface("BindSample.js");
	};

}(jQuery));