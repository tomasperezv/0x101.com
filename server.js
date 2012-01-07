var sys = require("sys"),
	http = require("http"),
	url = require("url"),
	path = require("path"),
	fs = require("fs"),
	ServerHelper = require("./js/server/server-helper.js");

http.createServer(function(request, response) {

	var uri = url.parse(request.url).pathname;
	var filename = path.join(process.cwd(), ServerHelper.constants.DEFAULT_DOCUMENT);
	sys.puts(filename);

	path.exists(filename, function(exists) {

		if(!exists) {
			ServerHelper.writeError(response, ServerHelper.constants.NOT_FOUND);
			response.end();
			return;
		}
		
		fs.readFile(filename, "binary", function(err, file) {
	
			if(err) {
	
				ServerHelper.writeError(response, ServerHelper.constants.SERVER_ERROR, err);
	
			} else if (ServerHelper.canServe(filename)) {
	
				try {

					sys.puts(filename);
					ServerHelper.writeHeader(response, filename);

					response.write(file, "binary");

				} catch (Error) {

					sys.puts(filename);
					ServerHelper.writeHeader(response, ServerHelper.constants.DEFAULT_DOCUMENT);

					response.write(file, "binary");

				}
	
			}
	
			response.end();
	
		});
	});

}).listen(ServerHelper.constants.PORT);

sys.puts("Server running at " + ServerHelper.constants.PORT + " port.");
