# Top Cloud

High level application framework for Javascript (built on top of haml-js and modeled somewhat after SproutCore)

This framework is very much a work in progress.  I should have something more concrete by the end of the week (August 22, 2009)

Top Cloud is a MVC framework for the browser, much in spirit of SproutCore, but made to be embedded inside existing legacy apps.

Top Cloud used my haml-js project for the dom-building aspect.

## Model

Models are actually server side entities.  There is a framework component that handles the syncing of the models browser side, but the code written by a user of Top Cloud lives entirely in the server.

Since the interaction with the backend is through some sort of data interchange (webservice) and technology can be used for the backend.  My initial version is for a legacy PHP app, but I intend to write sample ruby and node.js backends as well.

## View

This is an example View.  This is written in the topcloud interface language.  There is a textmate bundle for adding highlighting support included.

    // Dialog appends itself to the body
    Dialog#popup { width: 450, height: 300 }
    	title: "Browse Groups"
    	resizable: true
	
    	// Dropdown to toggle between the three modes
    	DropDown { left: 10, top: 10, right: 10, height: 20 }
    		options: {both: "All Contact Groups", notshared: "Only My Groups", shared: "Only Groups Shared With Me"}
    		value: @mode
	
    	// This draws the table with checkable rows
    	DataTable { left: 10, top: 40, right: 10, bottom: 50 }
    		content: @contact_groups
    		columns: {name: "Group Name", numContacts: "Contacts", isShared: "Shared with you?", options: "Options"}
    		checkbox: "selected"
    		observe: @mode
	
    	// Toolbar for buttons at bottom
    	Toolbar { left: 0, right: 0, bottom: 0, height: 40 }
    		Button { right: 10, top: 10, width: 70, height: 20 }
    			click: @submit
    			icon: "check"
    			value: "Submit"
    		Button { right: 90, top: 10, width: 70, height: 20 }
    			click: @cancel
    			icon: "close"
    			value: "Cancel"


## Controller

Controllers are javascript objects that are run in the browser.  They provide the code behind the views and hold all interaction logic.

Here is an example controller:

    /*globals TC */

    contact_management.browse_groups = function (options) {
    	TC.Controller.call(this); // Mixin the TC.Controller stuff
	
    	var $ = jQuery;
	
    	this.mode = "both";
	
    	this.cancel = function () {
    		this.components.popup.dialog('close');
    	};
	
    	this.submit = function () {
    		alert("TODO");
    	};

    	this.bindData({model: "ContactManagementModel", resource: "groups", as: "contact_groups"});
    };
