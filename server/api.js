/**
 * @author <tom@0x101.com>
 * @class Api
 */

var Posts = require('./model/Posts').Posts;
var Router = require('./router.js');
var qs = require('querystring');

responseA = null;

this.getDefaultData = function() {
	return {
		success: false,
		message: 'Unknown method'
	};
};

this.serve = function(request, response) {

	var apiMethod = request.url.substring(1);
	responseA = response;

	var data = this.getDefaultData();

	// TODO: Find a better way to redirect api calls to methods
	switch (apiMethod) {

		case 'getPosts':
			this.getPosts(this.responseCallback);
			break;
		
		case 'addPost':
			if (Router.isAdmin(request)) {
				this.addPost(request, this.responseCallback);
			} else {
				this.responseCallback({allowed: false});
			}
			break;
		
		default:
			this.responseCallback({});
			// Nothing to do here, move along
			break
	}

};

this.responseCallback = function(data) {
	responseA.writeHead(200, 'Content-type: application/json');
	responseA.write( JSON.stringify(data) );

	responseA.end();
};

this.getPosts = function(callback) {

	var posts = new Posts();
	posts.load({}, function(model) {
		callback(model.data);
	}, 1);

};

this.addPost = function(request, callback) {

	var api = this;

	var body = '';
	request.on('data', function (data) {
		body += data;
	});

	request.on('end', function () {

		var data = qs.parse(body);

		if (typeof data.content !== 'undefined') {
			var posts = new Posts();
			posts.create({content: data.content}, function(postId)	{
				if (typeof callback !== 'undefined') {
					console.log('created post ' + postId);
					callback({post: postId, date: api.getTimestamp()});
				}
			});
		} else {
			callback({});
		}

	});

};

this.getTimestamp = function(date) {

	if (typeof date === 'undefined') {
		var currentTime = new Date();
		var date = new Date(currentTime.getFullYear() + '-' + (currentTime.getMonth()+1) + '-' + currentTime.getDate());
	}   

	return Math.round((new Date(date)).getTime() / 1000);
};

