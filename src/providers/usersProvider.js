'use strict';

var mysqlDb = require('../../mysql/mysqlDatabase');

var UsersProvider = function() {
    if (!(this instanceof UsersProvider)) {
        return new UsersProvider();
    }
};

UsersProvider.prototype.getUsers = function(callback) {
    var dbConnection = mysqlDb.createConnection();

    var queryString = "SELECT * FROM users",
        values = [];

    dbConnection.query(
        queryString,
        values,
        function select(status, data) {
            callback(data);
        }
    );
};

UsersProvider.prototype.insertUser = function(options, callback) {
    var dbConnection = mysqlDb.createConnection();

    var queryString = "INSERT INTO `users`(`username`, `password`, `level`, `nb_games`, `nb_win`, `nb_lost`, `nb_draw`) VALUES (?,?,?,?,?,?,?)",
        values = [options.username, options.password, options.level, options.nb_games, options.nb_win, options.nb_lost, options.nb_draw];

    dbConnection.query(
        queryString,
        values,
        function select(status, data) {
            callback(data);
        }
    );
};

module.exports = UsersProvider;
