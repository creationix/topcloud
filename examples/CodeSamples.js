/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery, Dialog */

// This simulates a remote resource proxy, normally this would be an object that ajaxes the
// server to get and set data.  It even simulates a local cache to better test the dual nature
// of the code.
function TextSource() {
	var cache, value;
	
	value = "This data is in a database";
	
	this.get = function (callback) {
		if (cache === undefined) {
			setTimeout(function () {
				cache = value;
				callback(cache);
			}, 1000);
			
			return;
		}
		return cache;
	};
	
	this.set = function (new_value) {
		cache = new_value;
		setTimeout(function () {
			value = new_value;
		}, 1000);
	};
	
	this.invalidate = function () {
		cache = undefined;
	};
	
}

(function ($) {
	
	CodeSamples = Object.create(TC.Controller);
	
	CodeSamples.bindData({proxy: new TextSource(), as: "remote_text"});
	
	CodeSamples.cancel = function (button) {
		button.parent.parent.close();
	}

	CodeSamples.submit = function (button) {
		alert("TODO: Do some action");
		button.parent.parent.close();
	}

}(jQuery));