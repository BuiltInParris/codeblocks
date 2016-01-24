'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var javascripts = require('../../app/controllers/javascripts.server.controller');

	// Javascripts Routes
	app.route('/javascripts')
		.get(javascripts.list)
		.post(users.requiresLogin, javascripts.create);

	app.route('/javascripts/:javascriptId')
		.get(javascripts.read)
		.put(users.requiresLogin, javascripts.hasAuthorization, javascripts.update)
		.delete(users.requiresLogin, javascripts.hasAuthorization, javascripts.delete);

	// Finish by binding the Javascript middleware
	app.param('javascriptId', javascripts.javascriptByID);
};
