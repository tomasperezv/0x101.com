/**
 * Object model for the table posts
 *
 * create table posts(
 * 	id int not null,
 * 	date int,
 *	text string,
 * 	PRIMARY KEY(id)
 * );
 */
var DataBaseModel = require('./DataBaseModel');

Posts = function() {

	DataBaseModel.DataBaseModel.call(this);
	this.table = 'posts';

}

Posts.prototype = new DataBaseModel.DataBaseModel(); 

exports.Posts = Posts;
