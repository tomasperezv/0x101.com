/**
 * @author <tom@0x101.com>
 * @class Router
 */
this.response = null;

this.getDefaultData = function() {
	return {
		success: false,
		message: 'Unknown method'
	};
};

this.serve = function(request, response) {

	var apiMethod = request.url.substring(1);
	this.response = response;

	var data = this.getDefaultData();

	// TODO: Find a better way to redirect api calls to methods
	switch (apiMethod) {

		case 'getPosts':
			data = this.getPosts();
			break;

		default:
			// Nothing to do here, move along
			break
	}

	this.response.writeHead(200, 'Content-type: application/json');
	this.response.write( JSON.stringify(data) );

	this.response.end();

};

this.getPosts = function() {

	var data = {
		success: true,
		message: 'feedback!'
	};

	return data;

};

