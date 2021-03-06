/**
 * @author <tom@0x101.com>
 * @class Api
 */

var Post = require('./model/post').Post,
	User = require('./model/user').User,
	Salt = require('./model/salt').Salt,
	Session = require('./model/session').Session,
	Router = require('./router.js'),
	Handlebars = require('handlebars'),
	fs = require('fs'),
	qs = require('querystring');

responseA = null;

this.getDefaultData = function() {
	return {
		success: false,
		message: 'Unknown method'
	};
};

this.serve = function(request, response) {

	responseA = response;

	var apiMethod = request.url.substring(1),
	data = this.getDefaultData(),
	self = this;

	// TODO: Find a better way to redirect api calls to methods
	switch (apiMethod) {

		case 'getPosts':
			this.servePrivate(request, function(data) {
				self.getPosts(data);
			});

			break;

		case 'addUser':
			this.addUser(request);
			break;

		case 'login':
			this.login(request);
			break;
		
		case 'addPost':
			this.servePrivate(request, function(data) {
				self.addPost(data);
			});
			break;

		case 'updatePost':
			this.servePrivate(request, function(data) {
				self.updatePost(data);
			});

			break;

		case 'removePost':
			this.servePrivate(request, function(data) {
				self.removePost(data);
			});

			break;
			
		
		default:
			this.responseCallback({'status': 'active'});
			// Nothing to do here, move along
			break
	}

};

this.removeSessionParams = function(params) {
	delete params.login;
	delete params.session;
	return params;
};

this.servePrivate = function(request, callback) {

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
					data = api.removeSessionParams(data);
					callback(data);
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

	var api = this,
	templateName = './blog/templates/posts.mustache';

	var posts = new Post();
	posts.load({}, function(model) {

		fs.readFile(templateName, "binary", function(err, template) {
			if (err) {
				console.log('Template not found');
				api.responseCallback({});
			} else {
				console.log('serving template ' + templateName);

				var template = Handlebars.compile(template);
				var output = template({post: model.data});

				responseA.writeHead(200, {'Access-Control-Allow-Origin': '*', 'Content-type': 'text/html'});
				responseA.write(output, "binary");
				responseA.end();
			}
		});

	});

};

this.addPost = function(data) {

	var api = this;

	if (typeof data.content !== 'undefined') {
		var posts = new Post();
		posts.create({content: data.content, date: posts.getTimestamp()}, function(postId)	{
			console.log('created post ' + postId);
			api.responseCallback({id: postId});
		});
	}

};

this.updatePost = function(data) {

	var api = this;

	if (typeof data.content !== 'undefined') {

		var post = new Post();

		if (typeof data.date === 'undefined') {
			// Update the timestamp automatically
			data.date = post.getTimestamp();
		}

		post.update(data, function(postContent)	{
			api.responseCallback(postContent);
		});
	}

};

this.removePost = function(data) {

	var api = this;

	if (typeof data.content !== 'undefined') {
		var post = new Post();
		post.remove(data, function(postId)	{
			api.responseCallback({id: postId});
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
		var data = qs.parse(body),
		user = new User();

		user.validate(data.login, data.password, function(user) {

			if (typeof user.id !== 'undefined') {

				var session = new Session();
				session.createAndLoad({user_id: user.id, challenge: session.getRandomString(), creation_date: session.getTimestamp()}, function(session) {
					// Add the username to the session info
					session.login = data.login;
					api.responseCallback(session);
				});

			} else {
				api.responseCallback({});
			}

		});
	});
};

