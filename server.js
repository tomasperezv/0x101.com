var sys = require("sys"),
	http = require("http"),
	path = require("path"),
	fs = require("fs"),
	ServerCore = require("./server/server-core.js");
	Router = require('./server/router.js');

http.createServer(function(request, response) {

	Router.serveRequest(request, response);	

}).listen(ServerCore.constants.PORT);

sys.puts("Server running at " + ServerCore.constants.PORT + " port.");
