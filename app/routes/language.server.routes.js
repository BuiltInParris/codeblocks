
'use strict';

module.exports = function(app) {
        // Root routing
        var controller = require('../../app/controllers/language.server.controller');
        app.route('/language').get(controller.language);
};

