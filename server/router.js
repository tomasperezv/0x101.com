/**
  * @author <tom@0x101.com>
  * @class Router
  */

var sys = require('sys'),
	path = require("path"),
	fs = require('fs');

require.extensions['.json'] = function (m) {
	m.exports = JSON.parse(fs.readFileSync(m.filename));
};

this.domainsConfiguration = require("./conf/domains.json");
this.allowedFolders = require("./conf/allowed-folders.json");
this.serverConfiguration = require("./conf/server.json");

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

this.getFileName = function(requestUrl, domain, port) {

	var currentSection = this.getCurrentSection(domain);

	if (currentSection == '' || typeof this.allowedFolders[currentSection] === 'undefined') {
		// Fix the current section
		currentSection = this.serverConfiguration.DEFAULT_SECTION;
		console.log('Invalid or default section, fixing to ' + currentSection);
	}

	var filename = this.generateFileName(requestUrl, currentSection);

	console.log(filename);

	return filename;
};

