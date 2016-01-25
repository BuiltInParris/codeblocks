'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var objectivecs = require('../../app/controllers/objectivecs.server.controller');

	// ObjectiveCs Routes
	app.route('/objectivecs')
		.get(objectivecs.list)
		.post(users.requiresLogin, objectivecs.create);

	app.route('/objectivecs/:objectivecId')
		.get(objectivecs.read)
		.put(users.requiresLogin, objectivecs.hasAuthorization, objectivecs.update)
		.delete(users.requiresLogin, objectivecs.hasAuthorization, objectivecs.delete);

	// Finish by binding the ObjectiveC middleware
	app.param('objectivecId', objectivecs.objectivecByID);
};
