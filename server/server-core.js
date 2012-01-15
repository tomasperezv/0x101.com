/**
  * @author <tom@0x101.com>
  * @class ServerCore
  */

var fs = require('fs'),
	url = require("url"),
	path = require("path"),
	FileTypeFactory = require("../fw/loader/file-type-factory.js").FileTypeFactory,
	FileTypeJavascript = require("../fw/loader/file-type.js").FileTypeJavascript,
	FileTypeCSS = require("../fw/loader/file-type.js").FileTypeCSS,
	FileType = require("../fw/loader/file-type.js").FileType,
	Config = require("./config.js"),
	Router = require('./router.js');

this.constants = Config.get('server');
this.allowedExtensions = Config.get('allowed-extensions'); 

this.writeHeader = function(response, filename) {
	var fileTypeFactory = new FileTypeFactory();
	var fileType = fileTypeFactory.getFileType(filename); 
	response.writeHead(fileType.getHTTPCode(), fileType.getHeader());
};

this.writeError = function(response, errorCode, err) {

	if (typeof err === 'undefined') {
		err = {};
	}

	var fileType = new FileType();
	var content = '';

	switch(errorCode) {
		case this.constants.NOT_FOUND: {
			content = "not found";
			break;
		}
		case this.constants.FORBIDDEN: {
			content = "forbidden";
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

this.serve = function(fileName, response) {

	var ServerCore = this;

	path.exists(fileName, function(exists) {

		if(!exists) {
			ServerCore.writeError(response, ServerCore.constants.NOT_FOUND);
			response.end();
			return;
		}
		
		fs.readFile(fileName, "binary", function(err, file) {
	
			if(err) {
	
				ServerCore.writeError(response, ServerCore.constants.SERVER_ERROR, err);
	
			} else if ( ServerCore.canServe(fileName) ) {

				try {

					console.log('Routing request for ' + fileName);

					ServerCore.writeHeader(response, fileName);

					response.write(file, "binary");

				} catch (Error) {

					console.log('Error serving ' + fileName);

					ServerCore.writeHeader(response, ServerCore.constants.DEFAULT_DOCUMENT);

					response.write(file, "binary");

				}
	
			} else {
				console.log('Trying to access to forbidden extension.');
				ServerCore.writeError(response, ServerCore.constants.FORBIDDEN);
			}
	
			response.end();
	
		});
	});

};

/**
 * Determine if we can serve the filename, checking whether the extension is included
 * in the allowed-extensions.json.
 *
 * @author tom@0x101.com
 */
this.canServe = function(filename) {

	var extension = filename.split('.').pop().toLowerCase()

	return filename.length > 0 && typeof this.allowedExtensions[extension] !== 'undefined';
};

