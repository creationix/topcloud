# Top Cloud

High level application framework for Javascript (built on top of haml-js and modeled somewhat after SproutCore)

This framework is very much a work in progress.  I'm giving a presentation on it at the local Dallas Ruby Group for October's meeting.  I'll post a recording of the presentation if possible.

The source code to my example site is at the node-topcloud-chat repo.

Top Cloud is a MVC framework for the browser, much in spirit of SproutCore, but made to be embedded inside existing legacy apps.

Top Cloud uses the haml-js project for the dom-building aspect.

## Model

TopCloud has databinding at the controller level.  The bound variables can optionally use proxy objects that can in turn proxy to model classes on the server side if desired.

## View

This is an example View.  This is written in the TopCloud interface language.  There is a TextMate bundle for adding highlighting support included.

    Dialog width: 400, height: 250
    	minWidth: 300
    	minHeight: 200
    	title: "Code Samples"
	
    	Panel left: 0, bottom: 0, right: 0, height: 40
    		borderTop: 1
	
    		Button left: 10, top: 10, width: 65, height: 20
    			value: "Cancel"
    			icon: "cancel"
    			click: @cancel
    		Button right: 10, top: 10, width: 68, height: 20
    			value: "Submit"
    			icon: "check"
    			click: @submit
    
    	DropDown left: 10, top: 10, right: 10, height: 20
    		value: "ruby"
    		options: {ruby: "Ruby", "javascript": "Javascript", "python": "Python"}
    
    	TextEntry left: 10, top: 40, right: 10, bottom: 50
    		value: @remote_text
    		multiline: true


## Controller

Controllers are javascript objects that are run in the browser.  They provide the code behind the views and hold all interaction logic.

Here is an example controller:

    TC.defineController("Dialogs.CodeSamples", function (lang) {
    
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
	
    });
