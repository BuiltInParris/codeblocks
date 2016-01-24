'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Python = mongoose.model('Python'),
	_ = require('lodash');

/**
 * Create a Python
 */
exports.create = function(req, res) {
	var python = new Python(req.body);
	python.user = req.user;

	python.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(python);
		}
	});
};

/**
 * Show the current Python
 */
exports.read = function(req, res) {
	res.jsonp(req.python);
};

/**
 * Update a Python
 */
exports.update = function(req, res) {
	var python = req.python ;

	python = _.extend(python , req.body);

	python.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(python);
		}
	});
};

/**
 * Delete an Python
 */
exports.delete = function(req, res) {
	var python = req.python ;

	python.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(python);
		}
	});
};

/**
 * List of Pythons
 */
exports.list = function(req, res) { 
	Python.find().sort('-created').populate('user', 'displayName').exec(function(err, pythons) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pythons);
		}
	});
};

/**
 * Python middleware
 */
exports.pythonByID = function(req, res, next, id) { 
	Python.findById(id).populate('user', 'displayName').exec(function(err, python) {
		if (err) return next(err);
		if (! python) return next(new Error('Failed to load Python ' + id));
		req.python = python ;
		next();
	});
};

/**
 * Python authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.python.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
