'use strict';


var express = require('express');
var gamesController = require('../controllers/gamesController')();
var routesUtils = require('./utils')();
var router = express.Router();

/* returns all users */
router.get('/', function(req, res) {
    gamesController.getGames(function(response) {
        routesUtils.sendResponse(res, response);
    });
});

module.exports = router;
