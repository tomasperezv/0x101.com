/**
 * Object model for the table users
 *
 * create table users(
 * 	id int not null,
 * 	date int,
 *	text string,
 * 	PRIMARY KEY(id)
 * );
 */
var DataBaseModel = require('./DataBaseModel');

User = function() {

	DataBaseModel.DataBaseModel.call(this);
	this.table = 'users';

}

User.prototype = new DataBaseModel.DataBaseModel(); 

exports.User = User;
