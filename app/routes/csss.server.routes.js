'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var csss = require('../../app/controllers/csss.server.controller');

	// CSS Routes
	app.route('/csss')
		.get(csss.list)
		.post(users.requiresLogin, csss.create);

	app.route('/csss/:cssId')
		.get(csss.read)
		.put(users.requiresLogin, csss.hasAuthorization, csss.update)
		.delete(users.requiresLogin, csss.hasAuthorization, csss.delete);

	// Finish by binding the CSS middleware
	app.param('cssId', csss.cssByID);
};
