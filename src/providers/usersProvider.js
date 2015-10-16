'use strict';

var mysqlDb = require('../../mysql/mysqlDatabase');

var UsersProvider = function() {
    if (!(this instanceof UsersProvider)) {
        return new UsersProvider();
    }
};

UsersProvider.prototype.getUsers = function(callback) {
    var dbConnection = mysqlDb.createConnection();

    var queryString = "SELECT * FROM roles",
        values = [];

    dbConnection.query(
        queryString,
        values,
        function select(status, data) {
            callback(data);
        }
    );
};

module.exports = UsersProvider;
