/**
  * @author <tom@0x101.com>
  * @class Router
  */

var sys = require('sys'),
	path = require("path"),
	fs = require('fs'),
	ServerCore = require("./server-core.js"),
	Api = require("./api.js");

require.extensions['.json'] = function (m) {
	m.exports = JSON.parse(fs.readFileSync(m.filename));
};

this.domainsConfiguration = require("./conf/domains.json");
this.allowedFolders = require("./conf/allowed-folders.json");
this.serverConfiguration = require("./conf/server.json");
this.apiConfiguration = require("./conf/api.json");

/**
 * @author tom@0x101.com
 */
this.serveRequest = function(request, response) {

	if (this.isApiRequest(request)) {

		console.log('Api request...');
		Api.serve(request, response);

	} else {

		var filename = this.getFileName(request);
		ServerCore.serve(filename, response);

	}
};

this.isApiRequest = function(request) {
	return this.getDomain(request) === this.apiConfiguration.domain;
};

this.getCurrentSection = function(domain) {

	var currentSection = '';

	// TODO: Optimize the loop, the info should be stored in a more optimal 
	// data structure

	// TODO: Also add support for the path
	for (var section in this.domainsConfiguration) {

		var nSubSections = this.domainsConfiguration[section].length;

		for (var i = 0; i < nSubSections; i++) {
			if (this.domainsConfiguration[section][i].domain == domain) {
				currentSection = section;
				break;
			}
		}

		if (currentSection !== '') {
			break;
		}
	}

	return currentSection;
};

this.generateFileName = function(requestUrl, currentSection) {
	var filename = path.join(process.cwd(), currentSection);
	return path.join(filename, requestUrl);
};

/**
 * Returns the real path of the file that we want to server, depending on the
 * domains-conf.json file
 */
this.getFileName = function(request) {

	var requestUrl = request.headers['host'];

	var domain = this.getDomain(request);
	var port = this.getPort(requestUrl);

	var url = (request.url == '/' ? ServerCore.constants.DEFAULT_DOCUMENT : request.url);

	var currentSection = this.getCurrentSection(domain);

	if (currentSection == '' || typeof this.allowedFolders[currentSection] === 'undefined') {
		// Fix the current section
		currentSection = this.serverConfiguration.DEFAULT_SECTION;
		console.log('Invalid or default section, fixing to ' + currentSection);
	}

	var filename = this.generateFileName(url, currentSection);

	console.log(filename);

	return filename;
};

this.getDomain = function(request) {

	var requestUrl = request.headers['host'];
	
	var domain = null;

	var result = requestUrl.match(/[^:0-9]*/);

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



