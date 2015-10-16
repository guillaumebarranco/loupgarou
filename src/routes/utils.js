'use strict';

var RoutesUtils = function() {
    if (!(this instanceof RoutesUtils)) {
        return new RoutesUtils();
    }
};

RoutesUtils.prototype.sendResponse = function(res, response) {
    var code = response.code ? response.code : 200;
    if(response.status === "error" && !response.code) {
        code = 418;
    }
    res.status(code).send(response);
};

module.exports = RoutesUtils;