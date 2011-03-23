var loadDefinition = {
		files: [
				"css/editor.css",
				"js/ace/ace.js",
				"js/ace/theme-twilight.js",
				{
						url: "js/ace/mode-javascript.js", 
						callback: function() {}
				}
		],
		onLoad : function() {
				// Code executed when all the elements are already loaded
				var editor = ace.edit("editor");
				editor.setTheme("ace/theme/twilight");
		    
				var JavaScriptMode = require("ace/mode/javascript").Mode;
				editor.getSession().setMode(new JavaScriptMode());
		}
}

htmlLoader = new loader();
htmlLoader.run(loadDefinition);
