if (typeof exports !== 'undefined') {
		FileType = require("./fileType");
		var FileTypeJavascript = FileType.FileTypeJavascript;
		var FileTypeCSS = FileType.FileTypeCSS;
		var FileType = FileType.FileType;
}

/**
  * @author <tom@0x101.com>
  * @class FileTypeFactory
  */
var FileTypeFactory = function() { 

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
								return new FileTypeJavascript(filename);
								break;
						}
						case this.CSS: {
								return new FileTypeCSS(filename);
								break;
						}
						default: {
								return new FileType(filename);
								break;
						}
				}
		};
}

if (typeof exports !== 'undefined') {
		exports.FileTypeFactory = FileTypeFactory;
}

