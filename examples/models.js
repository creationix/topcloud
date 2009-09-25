
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
