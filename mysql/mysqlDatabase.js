'use strict';

var mysql = require('mysql');
var dbConfig = require("./mysqlConfig.json");

module.exports = {

    createConnection: function(database) {
        if(!database) {
            database = 'lg';
        }
        return mysql.createConnection(dbConfig['dev'][database]);
    },
    closeConnection: function(connection) {
        connection.end();
    }
};
