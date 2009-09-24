/*jslint white: true, onevar: true, evil: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery */

(function ($) {
	
	var indent = "\t";
	
	// Compiler for TCI (Top Cloud Interface) files.
	TC.Compiler = function (text) {
		var empty_regex = new RegExp("^(?:" + indent + ")*(?://.*)?$"),
				component_regex = new RegExp("^((?:" + indent + ")*)([A-Z][a-zA-Z0-9_]*) *(.*)(?://.*)?$"),
				param_regex = new RegExp("^((?:" + indent + ")*)" + indent + "([a-z][A-Za-z0-9_]*): *(.*)(?://.*)?$"),
				data = [],
				stack = [],
				component,
				current = {parent: data, depth: 0};
		
		function process_component(line, indent, name, layout_string) {
			var layout, depth = indent.length;
			eval('layout = {' + layout_string + '};');
			if (indent.length > current.depth) {
				stack.push({parent: current.parent, depth: current.depth});
				if (component.children === undefined) {
					component.children = [];
				}
				current = {
					parent: component.children,
					depth: depth
				};
			}
			while (indent.length < current.depth && stack.length > 0) {
				current = stack.pop();
			}
			component = {
				params: {},
				name: name,
				layout: layout
			};
			current.parent.push(component);
		}
		
		function process_param(line, indent, key, value_string) {
			var value, match;
			if (indent.length !== current.depth) {
				throw ("Indentation mismatch: \n" + line);
			}
			match = value_string.match(/^@([a-z][a-zA-Z0-9_]*)$/);
			if (match) {
				value = match[1];
				key = '@' + key;
			} else {
				eval('value = (' + value_string + ');');
			}
			component.params[key] = value;
		}
				
		// Process the file line by line
		$.each(text.split("\n"), function (line_index, line) {
			var match;
			if (line.match(empty_regex)) {
				return;
			}
			match = line.match(component_regex);
			if (match) {
				return process_component.apply(this, match);
			}
			match = line.match(param_regex);
			if (match) {
				return process_param.apply(this, match);
			}
			throw ("TopCloud interface syntax error: \n" + line);
		});
		
		return data;
	};

}(jQuery));