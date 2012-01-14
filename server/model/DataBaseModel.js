/**
 * @author tom@0x101.com
 *
 * Base object for representing tables in the DB and perform operations with
 * them. 
 *
 * Example: (for a given Post object)
 * 
 * posts.load({id: 1},function(data) {
 * 	console.log(data);
 * });
 * 
 * posts.create({text: 'test'}, function(id) {
 * 	console.log('created blog post: ' + id);
 * })
 */
var SQLiteConnection = require('../database/SQLiteConnection');

DataBaseModel = function() {

	this.table = '';
	this.lastQuery = '';
	this.data = [];

};

/**
 * Return the contents of the last query executed in the DB as an array of
 * objects. (Each element of the array is a row)
 * @return Array
 */
DataBaseModel.prototype.getData = function() {
	var data = [];

	if (this.data.length > 0) {
		data = this.data[0];
	}

	return data;
};

/**
 * Performs a load from the DB depending on the filters that we specify.
 * 
 * Example:
 *
 * posts.load({id: 2},function(data) {
 * 	console.log(data);
 * });
 *
 * @param Array filters 
 * @param Function onSuccess
 */
DataBaseModel.prototype.load = function(filters, onSuccess) {

	if (typeof filters === 'undefined') {
		var filters = {};
	}
	
	this.lastQuery = this.getLoadQuery(filters);

	var sqliteConnection = new SQLiteConnection.SQLiteConnection(); 

	var model = this;

	sqliteConnection.select(this.lastQuery, function(rows) {
		model.data = rows;
		onSuccess(model);
	});
};


/**
 * Add a new register in the DB:
 *
 * posts.create({text: 'test'}, function(id) {
 * 	console.log('created: ' + id);
 * })
 *
 * It passes the id of the row created to the callback.
 *
 * @param Object data
 * @param Function onSuccess
 */
DataBaseModel.prototype.create = function(data, onSuccess) {

	this.lastQuery = this.getInsertQuery(data);

	var sqliteConnection = new SQLiteConnection.SQLiteConnection(); 
	sqliteConnection.insert(this.lastQuery, function() {
		sqliteConnection.select('SELECT last_insert_rowid() as last_id;', function(row) {
			if (row.length > 0) {
				onSuccess(row[0]['last_id']);
			}
		});
	});
};

/**
 * Builds an insert query.
 *
 * @param Object data 
 * @return String
 */
DataBaseModel.prototype.getInsertQuery = function(data) {

	var numFields = Object.keys(data).length;

	var query = 'INSERT INTO ' + this.table;

	query += '(';
	var currentPosition = 0;
	for (fieldName in data) {
		query += fieldName;

		currentPosition++;

		if (currentPosition < numFields) {
			query += ',';
		}
	}

	query += ')';

	query += ' VALUES(';

	currentPosition = 0;

	for (fieldName in data) {

		var value = data[fieldName];

		if (typeof value === 'string') {
			query += '"' + value + '"';
		} else {
			query += value;
		}

		currentPosition++;

		if (currentPosition < numFields) {
			query += ',';
		}
	}
	
	query += ');';

	return query;	
};

/**
 * Builds a simple SELECT query.
 *
 * @param Object filters 
 */
DataBaseModel.prototype.getLoadQuery = function(filters) {

	var query = 'SELECT * FROM ' + this.table + ' WHERE ';

	if (Object.keys(filters).length === 0) {
		query += '1';
	} else {

		var first = true;
		
		for (fieldName in filters) {
			if (!first) {
				query += 'AND ';
				first = false;
			}

			query += fieldName + ' = ' + filters[fieldName];	
		}
	}

	query += ';';

	return query;
};

exports.DataBaseModel = DataBaseModel;
