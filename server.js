var sys = require("sys"),
		http = require("http"),
		url = require("url"),
		path = require("path"),
		fs = require("fs"),
		serverHelper = require("./server/serverHelper");

http.createServer(function(request, response) {
		var uri = url.parse(request.url).pathname;
		var filename = path.join(process.cwd(), uri);
		path.exists(filename, function(exists) {
				if(!exists) {
						serverHelper.writeError(response, serverHelper.constants.NOT_FOUND);
						response.end();
						return;
				}
	
				fs.readFile(filename, "binary", function(err, file) {
						if(err) {
								serverHelper.writeError(response, serverHelper.constants.SERVER_ERROR, err);
						} else {
								serverHelper.writeHeader(response, filename);
								response.write(file, "binary");
						}
						response.end();
				});
		});
}).listen(serverHelper.constants.PORT);

sys.puts("Server running at " + serverHelper.constants.PORT + " port.");
