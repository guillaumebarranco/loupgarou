'use strict';


var express = require('express');
var usersController = require('../controllers/usersController')();
var routesUtils = require('./utils')();
var router = express.Router();

/* returns all users */
router.get('/', function(req, res) {
    usersController.getUsers(function(response) {
        routesUtils.sendResponse(res, response);
    });
});

router.post('/insert', function(req, res) {

	var options = req.body.data;

    usersController.insertUser(options, function(response) {
        routesUtils.sendResponse(res, response);
    });
});

module.exports = router;
