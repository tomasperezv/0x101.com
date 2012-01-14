/**
  * @author <tom@0x101.com>
  * @class ServerHelper
  */

var sys = require('sys'),
	fs = require('fs'),
	url = require("url"),
	path = require("path"),
	FileTypeFactory = require("../fw/loader/file-type-factory.js").FileTypeFactory,
	FileTypeJavascript = require("../fw/loader/file-type.js").FileTypeJavascript,
	FileTypeCSS = require("../fw/loader/file-type.js").FileTypeCSS,
	FileType = require("../fw/loader/file-type.js").FileType,
	Router = require('./router.js');

require.extensions['.json'] = function (m) {
	m.exports = JSON.parse(fs.readFileSync(m.filename));
};

this.constants = require("./conf/server.json");
this.allowedExtensions = require("./conf/allowed-extensions.json");

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

this.getDomain = function(host) {
	
	var domain = null;

	var result = host.match(/[^:0-9]*/);

	if (result.length > 0) {
		domain = result[0];
	}

	return domain;
	
};

this.getPort = function(host) {

	var port = null;
	var result = host.match(/:[0-9]*/);

	if (result !== null && result.length > 0) {
		port = result[0].replace(/:/, '');
	}

	return port;
};

/**
 * Returns the real path of the file that we want to server, depending on the
 * domains-conf.json file
 */
this.getFileName = function(request) {

	var requestUrl = request.headers['host'];

	var domain = this.getDomain(requestUrl);
	var port = this.getPort(requestUrl);

	var url = (request.url == '/' ? this.constants.DEFAULT_DOCUMENT : request.url);

	return Router.getFileName(url, domain, port);
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

