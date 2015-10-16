'use strict';


var express = require('express');
var rolesController = require('../controllers/rolesController')();
var routesUtils = require('./utils')();
var router = express.Router();

/* returns all users */
router.get('/login', function(req, res) {
    //rolesController.getRoles(function(response) {
        routesUtils.sendResponse(res, {response: 'ok'});
    //});
});

router.get('/register', function(req, res) {
    //rolesController.getRoles(function(response) {
        routesUtils.sendResponse(res, {response: 'ok'});
    //});
});

module.exports = router;
