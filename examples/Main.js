/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery, Main */

(function ($) {
	
	Main = Object.create(TC.Controller);
	
	Main.open_dialog = function (button) {
		TC.render_interface("Dialog.js");
	}

}(jQuery));