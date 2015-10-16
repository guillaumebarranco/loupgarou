'use strict';

var mysqlDb = require('../../mysql/mysqlDatabase');

var RolesProvider = function() {
    if (!(this instanceof RolesProvider)) {
        return new RolesProvider();
    }
};

RolesProvider.prototype.getRoles = function(callback) {
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

module.exports = RolesProvider;
