'use strict';

var mysqlDb = require('../../mysql/mysqlDatabase');

var GamesProvider = function() {
    if (!(this instanceof GamesProvider)) {
        return new GamesProvider();
    }
};

GamesProvider.prototype.getGames = function(callback) {
    var dbConnection = mysqlDb.createConnection();

    var queryString = "SELECT * FROM games WHERE is_playing = 0 AND is_finished = 0",
        values = [];

    dbConnection.query(
        queryString,
        values,
        function select(status, data) {
            callback(data);
        }
    );
};

GamesProvider.prototype.createGame = function(game, callback) {
    var dbConnection = mysqlDb.createConnection();

    var n=Math.floor(Math.random()*11);
    var k = Math.floor(Math.random()* 1000000);
    var uniqd = String.fromCharCode(n)+k;

    var queryString = "INSERT INTO `games`(name, author, is_playing, is_finished, players, has_password, password, uniqd) VALUES (?,?,?,?,?,?,?)",
        values = [game.name, game.author, game.is_playing, game.is_finished, game.players, game.has_password, game.password, uniqd];

    dbConnection.query(
        queryString,
        values,
        function select(status, data) {

            var option = {id: uniqd};
            callback(option);
        }
    );
};

module.exports = GamesProvider;
