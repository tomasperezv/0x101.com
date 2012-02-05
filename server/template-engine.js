/**
  * @author <tom@0x101.com>
  * @class TemplateEngine
  */

ServerCore = require("./server-core.js"),

this.processData = function(config) {
	return this.actions[config.action]();
};

this.blog = {
	index: function() {
		return {
			title: 'blog.tomasperez.com',
			static_domain: ServerCore.staticDomain(),
			description: 'my personal blog'			
		}
	}
};

this.admin = {
	index: function() {
		return {
			title: 'blog.tomasperez.com',
			static_domain: ServerCore.staticDomain(),
			api_url: ServerCore.apiDomain(),
			domain: 'tomasperez.com',
			description: 'Admin panel'
		}
	}
};

this.actions = {
	'blog.index': this.blog.index,
	'admin.index': this.admin.index
};

