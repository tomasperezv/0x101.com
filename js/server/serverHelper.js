var sys = require('sys');
FileTypeFactory = require("../fw/loader/fileTypeFactory");
FileType = require("../fw/loader/fileType");

if (typeof exports !== 'undefined') {
		var FileTypeFactory = FileTypeFactory.FileTypeFactory;
		var FileTypeJavascript = FileType.FileTypeJavascript;
		var FileTypeCSS = FileType.FileTypeCSS; 
		var FileType = FileType.FileType;
}

this.constants = {
		DEFAULT_DOCUMENT: 'index.htm',
		PORT: 80,
		NOT_FOUND: 0,
		SERVER_ERROR: 1,
		ROOT: '/media/tomasperezv/Dropbox/Ariadna/scripts/javascript/joyentcloud/repo/index.htm'
};

this.writeHeader = function(response, filename) {
		var fileTypeFactory = new FileTypeFactory();
		var fileType = fileTypeFactory.getFileType(filename); 
		response.writeHead(fileType.getHTTPCode(), fileType.getHeader());
};

this.writeError = function(response, errorCode, err) {
		var fileType = new FileType();
		var content = '';
		switch(errorCode) {
				case this.constants.NOT_FOUND: {
						content = "not found";
						break;
				}
				default:
				case this.constants.SERVER_ERROR: {
						content = err + " " + errorCode  + "\n" + JSON.stringify(err);
				}
		}

		response.writeHead(errorCode, fileType.getHeader());
		response.write(content);
};

this.canSolve = function(error) {
		canSolve = false;
		switch(error.errno) {
				case this.constants.IS_FOLDER: {
						canSolve = true;
						break;
				}
		}
		return true;
		return canSolve;
};

this.solve = function(filename) {
		return this.constants.ROOT;
}

this.canServe = function(filename) {
		// TODO: implement security policy here.
		return filename.length > 0;
}

