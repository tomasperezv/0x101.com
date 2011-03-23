var serverHelper = exports;

serverHelper.constants = {
		PORT: 80,
		NOT_FOUND: 0,
		SERVER_ERROR: 1,
		TEXT_PLAIN: 2,
		JS: 3,

		CONTENT_ERROR: {"Content-Type": "text/plain"},
		CONTENT_PLAIN: {},
		CONTENT_JS: {"Content-Type": "application/javascript"}
};

serverHelper.headers = {
		0: {
			code: 404,
			content: serverHelper.constants.CONTENT_ERROR
		},
		1: {
			code: 500,
			content: serverHelper.constants.CONTENT_ERROR
		},
		2: {
			code: 200,
			content: serverHelper.constants.CONTENT_PLAIN
		},
		3: {
			code: 200,
			content: serverHelper.constants.CONTENT_JS
		}
};

serverHelper.getHeader = function(type) {
		if (typeof serverHelper.headers[type] !== 'undefined') {
				return serverHelper.headers[type];
		} else {
				return serverHelper.headers[serverHelper.constants.CONTENT_PLAIN];
		}
}	

serverHelper.writeHeader = function(response, filename) {
		if (filename.split('.').pop().toLowerCase() == 'js') {
				var headerData = serverHelper.getHeader(serverHelper.constants.JS);
		} else {
				var headerData = serverHelper.getHeader(serverHelper.constants.TEXT_PLAIN);
		}
		response.writeHead(headerData.code, headerData.content);
}

serverHelper.writeError = function(response, errorCode, err) {
		switch(errorCode) {
				case serverHelper.constants.NOT_FOUND: {
						var headerData = serverHelper.getHeader(serverHelper.constants.NOT_FOUND);
						response.writeHead(headerData.code, headerData.content);
						response.write("404 Not Found\n");
						break;
				}
				default:
				case serverHelper.constants.SERVER_ERROR: {
						var headerData = serverHelper.getHeader(serverHelper.constants.SERVER_ERROR);
						response.writeHead(headerData.code, headerData.content);
						response.write(err + "\n");
				}
		}
}

