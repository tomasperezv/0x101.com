var fileTypeJavascript = function(url) {

		this.url = url;
		this.type = "text/javascript";
		this.elementName = "script";

		/**
		 * @author <tom@0x101.com>
		 */
		this.render = function(callback) {
				var element = document.createElement(this.elementName);
				element.type = this.type;
				element.src = this.url;
				return element;
		}


}

var fileTypeCss = function(url) {

		this.url = url;
		this.elementName = "link";
		this.type = "text/css";
		this.rel = "stylesheet";

		/**
		 * @author <tom@0x101.com>
		 */
		this.render = function(callback) {
				var element = document.createElement(this.elementName);
				element.type = this.type;
				element.rel = this.rel;
				element.href = this.url;
				return element;
		}
}


var fileTypeFactory = function() { 

		/**
		 * constants 
		 */
		this.JAVASCRIPT = 'js';
		this.CSS = 'css';

		/**
		 * @author <tom@0x101.com>
		 */
		this.getFileType = function(filename) {
				switch (filename.split('.').pop().toLowerCase()) {
						case this.JAVASCRIPT: {
								return new fileTypeJavascript(filename);
								break;
						}
						case this.CSS: {
								return new fileTypeCss(filename);
								break;
						}
				}
		};
		
}

var loader = function() {

		this.fileTypeFactory = undefined;
		this.onLoad = undefined;
		this.loadedFiles = 0;

		/**
		 * @author <tom@0x101.com>
		 */
		this.getFileTypeFactory = function() {
				if (!this.fileTypeFactory) {
						this.fileTypeFactory = new fileTypeFactory();
				}
				return this.fileTypeFactory;
		};

		/**
		 * @author <tom@0x101.com>
		 */
		this.checkOnLoad = function() {
				// Call to the on load callback function, defined in the load definition
				// when we already loaded all the pending files.
				this.loadedFiles++;
				if (this.loadedFiles == this.loadDefinition.files.length-1) {
						this.loadDefinition.onLoad();
				}
		}

		/**
		 * @author <tom@0x101.com>
		 */
		this.bindCallback = function(element, callback) {
				var self = this;
				if (element.readyState) {
						element.onreadystatechange = function() {
								if (element.readyState == "loaded" || script.readyState == "complete") {
										element.onreadystatechange = null;
										if (typeof callback != 'undefined') {
												callback();
										}
										self.checkOnLoad();
								}
						};
				} else {
						element.onload = function() {
								if (typeof callback != 'undefined') {
										callback();
								}
								self.checkOnLoad();
						};
				}
		}

		/**
		 * @author <tom@0x101.com>
		 */
		this.load = function(url, callback) {

				var fileTypeFactory = this.getFileTypeFactory();
				var fileType = fileTypeFactory.getFileType(url);
				var element = fileType.render();
				this.bindCallback(element, callback);
		
				// Inject the script in the head
				document.getElementsByTagName("head")[0].appendChild(element);
		};

		/**
		 * @author <tom@0x101.com>
		 */
		this.run = function(loadDefinition) {

				this.loadDefinition = loadDefinition;

				for (var i = 0; i < loadDefinition.files.length; i++ ) {
						if (typeof loadDefinition.files[i] == "object") {
								this.load(loadDefinition.files[i].url, loadDefinition.files[i].callback);
						} else {
								this.load(loadDefinition.files[i]);
						}
				}
		};
}

