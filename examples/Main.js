/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery*/

TC.defineController("Main", function (params) {
	
	this.code_samples = function (button) {
		TC.render_interface("Dialogs/CodeSamples.js");
	};

	this.bind_sample = function (button) {
		TC.render_interface("Dialogs/BindSample.js");
	};

});
