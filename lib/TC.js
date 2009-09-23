/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals jQuery */

// TopCloud 
var TC = {
	
	// Prototype for all controllers will be defined here
	Controller: {},
	
	// Super constructor for all html components
	Component: function () {},

	// All components from the subfolder are stored in the namespace here.
	components: {},
	
	// Utility function used to generate css for absolute positioning
	parse_layout: function (layout) {
		var parent_width = layout.parent_width,
				parent_height = layout.parent_height,
				css = { display: "inline",	position: "absolute" };
		if (layout.left !== undefined) {
			css.left = layout.left + "px";
		}
		if (layout.top !== undefined) {
			css.top = layout.top + "px";
		}
		if (layout.right !== undefined) {
			if (jQuery.support.boxModel) {
				css.right = layout.right + "px";
			} else {
				if (layout.left !== undefined) {
					css.width = (parent_width - layout.right - layout.left) + "px";
				} else {
					if (layout.width !== undefined) {
						css.left = (parent_width - layout.right - layout.width) + "px";
					}
				}
			}
		}
		if (layout.bottom !== undefined) {
			// IE6 doesn't support "conflicting" sides.
			if (jQuery.support.boxModel) {
				css.bottom = layout.bottom + "px";
			} else {
				if (layout.top !== undefined) {
					css.height = (parent_height - layout.bottom - layout.top) + "px";
				} else {
					if (layout.height !== undefined) {
						css.top = (parent_height - layout.bottom - layout.height) + "px";
					}
				}
			}
		}
		if (layout.height !== undefined) {
			css.height = layout.height + "px";
		}
		if (layout.width !== undefined) {
			css.width = layout.width + "px";
		}
		return css;
	}
	
};
