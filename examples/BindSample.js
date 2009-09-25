/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery, Dialog */

(function ($) {
	
	BindSample = Object.create(TC.Controller);

	BindSample.bindData({value: "Change me!", as: "shared_value"});

}(jQuery));