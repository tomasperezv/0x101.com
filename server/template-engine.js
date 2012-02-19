/**
  * @author <tom@0x101.com>
  * @class TemplateEngine
  */

ServerCore = require("./server-core.js"),
Post = require('./model/post').Post;

this.processData = function(config, callback) {
	return this.actions[config.action](callback);
};

this.blog = {
	index: function(callback) {

		var post = new Post();
		post.load({}, function(model) {
			var firstPost = model.data[0].content;
			callback({
				title: 'blog.tomasperez.com',
				static_domain: ServerCore.staticDomain(),
				description: 'my personal blog',
				firstPost: firstPost
			});
		});

	}
};

this.admin = {
	index: function(callback) {
		callback({
			title: 'blog.tomasperez.com',
			static_domain: ServerCore.staticDomain(),
			api_url: ServerCore.apiDomain(),
			domain: 'tomasperez.com',
			description: 'Admin panel'
		});
	}
};

this.actions = {
	'blog.index': this.blog.index,
	'admin.index': this.admin.index
};

