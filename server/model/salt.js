/**
 * Object model for the table salts
 *
 * create table salts(
 * 	id int not null,
 * 	date int,
 *	text string,
 * 	PRIMARY KEY(id)
 * );
 */
var DataBaseModel = require('./DataBaseModel');

Salt = function() {

	DataBaseModel.DataBaseModel.call(this);
	this.table = 'salts';

}

Salt.prototype = new DataBaseModel.DataBaseModel(); 

exports.Salt = Salt;
