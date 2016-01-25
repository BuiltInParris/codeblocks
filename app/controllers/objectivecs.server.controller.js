'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ObjectiveC = mongoose.model('ObjectiveC'),
	_ = require('lodash');

/**
 * Create a ObjectiveC
 */
exports.create = function(req, res) {
	var objectivec = new ObjectiveC(req.body);
	objectivec.user = req.user;

	objectivec.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(objectivec);
		}
	});
};

/**
 * Show the current ObjectiveC
 */
exports.read = function(req, res) {
	res.jsonp(req.objectivec);
};

/**
 * Update a ObjectiveC
 */
exports.update = function(req, res) {
	var objectivec = req.objectivec ;

	objectivec = _.extend(objectivec , req.body);

	objectivec.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(objectivec);
		}
	});
};

/**
 * Delete an ObjectiveC
 */
exports.delete = function(req, res) {
	var objectivec = req.objectivec ;

	objectivec.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(objectivec);
		}
	});
};

/**
 * List of ObjectiveCs
 */
exports.list = function(req, res) { 
	ObjectiveC.find().sort('-created').populate('user', 'displayName').exec(function(err, objectivecs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(objectivecs);
		}
	});
};

/**
 * ObjectiveC middleware
 */
exports.objectivecByID = function(req, res, next, id) { 
	ObjectiveC.findById(id).populate('user', 'displayName').exec(function(err, objectivec) {
		if (err) return next(err);
		if (! objectivec) return next(new Error('Failed to load ObjectiveC ' + id));
		req.objectivec = objectivec ;
		next();
	});
};

/**
 * ObjectiveC authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.objectivec.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
