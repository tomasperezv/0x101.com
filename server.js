var sys = require("sys"),
	http = require("http"),
	path = require("path"),
	fs = require("fs"),
	ServerHelper = require("./js/server/server-helper.js");

http.createServer(function(request, response) {

	var fileName = ServerHelper.getFileName(request);

	path.exists(fileName, function(exists) {

		if(!exists) {
			ServerHelper.writeError(response, ServerHelper.constants.NOT_FOUND);
			response.end();
			return;
		}
		
		fs.readFile(fileName, "binary", function(err, file) {
	
			if(err) {
	
				ServerHelper.writeError(response, ServerHelper.constants.SERVER_ERROR, err);
	
			} else if ( ServerHelper.canServe(fileName) ) {

				try {

					console.log('Routing request for ' + fileName);

					ServerHelper.writeHeader(response, fileName);

					response.write(file, "binary");

				} catch (Error) {

					console.log('Error serving ' + fileName);

					ServerHelper.writeHeader(response, ServerHelper.constants.DEFAULT_DOCUMENT);

					response.write(file, "binary");

				}
	
			}
	
			response.end();
	
		});
	});

}).listen(ServerHelper.constants.PORT);

sys.puts("Server running at " + ServerHelper.constants.PORT + " port.");
