/**
 * @author <tom@0x101.com>
 * @class Api
 */

var Post = require('./model/post').Post,
	User = require('./model/user').User,
	Salt = require('./model/salt').Salt,
	Session = require('./model/session').Session,
	Router = require('./router.js'),
	qs = require('querystring');

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
			this.getPosts();
			break;

		case 'addUser':
			this.addUser(request);
			break;

		case 'login':
			this.login(request);
			break;
		
		case 'addPost':
			var self = this;
			this.servePrivate(request, function(data) {
				self.addPost(data);
			});
			break;
		
		default:
			this.responseCallback({'status': 'active'});
			// Nothing to do here, move along
			break
	}

};

this.servePrivate = function(request) {

	var api = this;

	var body = '';
	request.on('data', function (data) {
		body += data;
	});

	request.on('end', function () {

		var data = qs.parse(body);

		var user = new User();
		user.getByLogin(data.login, function(user) {

			var session = new Session();
			session.check(user.id, data.session, function(sessionData) {
				if (typeof sessionData.id !== 'undefined') {
					api.responseCallback(data);
				} else {
					api.responseCallback({});
				}
			});

		});

	});
};

this.responseCallback = function(data) {
	responseA.writeHead(200, {'Access-Control-Allow-Origin': '*', 'Content-type': 'application/json'});
	responseA.write( JSON.stringify(data) );

	responseA.end();
};

this.getPosts = function() {

	var api = this;

	var posts = new Post();
	posts.load({}, function(model) {
		api.responseCallback(model.data);
	});

};

this.addPost = function(data) {

	var api = this;

	if (typeof data.content !== 'undefined') {
		var posts = new Post();
		posts.create({content: data.content}, function(postId)	{
			if (typeof callback !== 'undefined') {
				console.log('created post ' + postId);
				api.responseCallback({post: postId, date: posts.getTimestamp()});
			}
		});
	}

};

this.addUser = function(request) {

	var api = this;

	var body = '';
	request.on('data', function (data) {
		body += data;
	});

	request.on('end', function () {
		var data = qs.parse(body);
		var user = new User();
		user.addUser(data.login, data.password, api.responseCallback);
	});

};

this.login = function(request) {

	var api = this;

	var body = '';
	request.on('data', function (data) {
		body += data;
	});

	request.on('end', function () {
		var data = qs.parse(body);
		var user = new User();
		console.log(data);
		user.validate(data.login, data.password, function(user) {

			if (typeof user.id !== 'undefined') {

				var session = new Session();
				session.createAndLoad({user_id: user.id, challenge: session.getRandomString(), creation_date: session.getTimestamp()}, function(session) {
					api.responseCallback(session);
				});

			} else {
				api.responseCallback({});
			}

		});
	});
};

