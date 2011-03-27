var sys = require("sys"),
		http = require("http"),
		url = require("url"),
		path = require("path"),
		fs = require("fs"),
		ServerHelper = require("./js/server/serverHelper");

http.createServer(function(request, response) {
		var uri = url.parse(request.url).pathname;
		var filename = path.join(process.cwd(), uri);
		path.exists(filename, function(exists) {
				if(!exists) {
						ServerHelper.writeError(response, ServerHelper.constants.NOT_FOUND);
						response.end();
						return;
				}
	
				fs.readFile(filename, "binary", function(err, file) {
						if(err && !ServerHelper.canSolve(err) ) {
								ServerHelper.writeError(response, ServerHelper.constants.SERVER_ERROR, err);
						} else if (false && ServerHelper.canSolve(err)) {
								var newFilename = ServerHelper.solve(filename);
								sys.puts(newFilename);
								fs.readFile(newFilename, "binary", function(err, file) {
										ServerHelper.writeHeader(response, newFilename);
										response.write(file, "binary");
								});
						} else if (ServerHelper.canServe(filename)) {
								sys.puts(filename);
								ServerHelper.writeHeader(response, filename);
								response.write(file, "binary");
						}

						response.end();
				});
		});
}).listen(ServerHelper.constants.PORT);

sys.puts("Server running at " + ServerHelper.constants.PORT + " port.");
