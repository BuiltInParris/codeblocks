'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var pythons = require('../../app/controllers/pythons.server.controller');

	// Pythons Routes
	app.route('/pythons')
		.get(pythons.list)
		.post(users.requiresLogin, pythons.create);

	app.route('/pythons/:pythonId')
		.get(pythons.read)
		.put(users.requiresLogin, pythons.hasAuthorization, pythons.update)
		.delete(users.requiresLogin, pythons.hasAuthorization, pythons.delete);

	// Finish by binding the Python middleware
	app.param('pythonId', pythons.pythonByID);
};
