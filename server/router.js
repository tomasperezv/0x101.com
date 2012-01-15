/**
  * @author <tom@0x101.com>
  * @class Router
  */
var	path = require("path"),
	fs = require('fs'),
	ServerCore = require("./server-core.js"),
	Config = require("./config.js"),
	Api = require("./api.js");

this.domainsConfiguration = Config.get('domains'); 
this.allowedFolders = Config.get('allowed-folders'); 
this.serverConfiguration = Config.get('server');
this.apiConfiguration = Config.get('api');

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

	filename = path.join(filename, requestUrl);

	// If the file exists, but it's a directory, then add the default file name to the url
	try {
		stats = fs.lstatSync(filename);
		if ( stats.isDirectory() ) {
			filename += '/' + this.serverConfiguration.DEFAULT_DOCUMENT;
		}
	} catch(e) {
	}

	return filename;
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

/**
 * TODO: Improve security
 * @author tom@0x101.com 
 */
this.isAdmin = function(request) {
	return request.connection.remoteAddress === '127.0.0.1';
};

