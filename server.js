var http = require("http"),
	Config = require("./server/config.js"),
	Router = require('./server/router.js');

var port = Config.get('server', 'PORT');

http.createServer(function(request, response) {

	Router.serveRequest(request, response);	

}).listen( port );

console.log("Server running at " + port + " port.");
