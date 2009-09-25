/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery, Dialog */

var BindSampleController = function () {

	this.bindData("shared_value", {
		value: "Change me!"
	});
	
};
BindSampleController.prototype = TC.Controller;
