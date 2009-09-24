/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery, Dialog */

(function ($) {
	
	Dialog = Object.create(TC.Controller);
	
	Dialog.cancel = function (button) {
		button.parent.parent.close();
	}

	Dialog.submit = function (button) {
		alert("TODO: Do some action");
		button.parent.parent.close();
	}

}(jQuery));