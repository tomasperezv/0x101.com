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

this.actions = {
	'blog.index': this.blog.index
};

