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

var DomainsConfiguration = require("./domains-conf.json");

this.getFileName = function(requestUrl, domain, port) {

	var currentSection = '';

	// TODO: Optimize the loop, the info should be stored in a more optimal 
	// data structure

	// TODO: Also add support for the path
	for (var section in DomainsConfiguration) {

		var nSubSections = DomainsConfiguration[section].length;

		for (var i = 0; i < nSubSections; i++) {
			if (DomainsConfiguration[section][i].domain == domain) {
				currentSection = section;
				break;
			}
		}

		if (currentSection !== '') {
			break;
		}
	}

	if (currentSection !== '') {
		var filename = path.join(process.cwd(), currentSection);
		filename = path.join(filename, requestUrl);
	} else {
		var filename = path.join(process.cwd(), requestUrl);
	}

	console.log(filename);

	return filename;
};

