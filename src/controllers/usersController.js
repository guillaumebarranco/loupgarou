'use strict';

var usersProvider = require('../providers/usersProvider')();

var UsersController = function() {
    if (!(this instanceof UsersController)) {
        return new UsersController();
    }
};

UsersController.prototype.getUsers = function(callback) {
    usersProvider.getUsers(function(response) {
        callback(response);
    });
};

UsersController.prototype.insertUser = function(options, callback) {
    usersProvider.insertUser(options, function(response) {
        callback(response);
    });
};

module.exports = UsersController;
