'use strict';

var gamesProvider = require('../providers/gamesProvider')();

var gamesController = function() {
    if (!(this instanceof gamesController)) {
        return new gamesController();
    }
};

gamesController.prototype.getGames = function(callback) {
    gamesProvider.getGames(function(response) {
        callback(response);
    });
};

gamesController.prototype.createGame = function(game, callback) {
    gamesProvider.createGame(game, function(response) {
        callback(response);
    });
};

module.exports = gamesController;
