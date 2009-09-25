/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery, Dialog */

CodeSamplesController = function () {

	this.bindData("remote_text", {
		proxy: new TextSource()
	});
	
	this.cancel = function (button) {
		button.parent.parent.close();
	};

	this.submit = function (button) {
		alert("TODO: Do some action");
		button.parent.parent.close();
	};
	
};
CodeSamplesController.prototype = TC.Controller;
