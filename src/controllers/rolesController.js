'use strict';

var rolesProvider = require('../providers/rolesProvider')();

var rolesController = function() {
    if (!(this instanceof rolesController)) {
        return new rolesController();
    }
};

rolesController.prototype.getRoles = function(callback) {
    rolesProvider.getRoles(function(response) {
        callback(response);
    });
};

module.exports = rolesController;
