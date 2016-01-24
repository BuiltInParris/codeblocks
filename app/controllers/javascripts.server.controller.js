'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Javascript = mongoose.model('Javascript'),
	_ = require('lodash');

/**
 * Create a Javascript
 */
exports.create = function(req, res) {
	var javascript = new Javascript(req.body);
	javascript.user = req.user;

	javascript.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(javascript);
		}
	});
};

/**
 * Show the current Javascript
 */
exports.read = function(req, res) {
	res.jsonp(req.javascript);
};

/**
 * Update a Javascript
 */
exports.update = function(req, res) {
	var javascript = req.javascript ;

	javascript = _.extend(javascript , req.body);

	javascript.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(javascript);
		}
	});
};

/**
 * Delete an Javascript
 */
exports.delete = function(req, res) {
	var javascript = req.javascript ;

	javascript.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(javascript);
		}
	});
};

/**
 * List of Javascripts
 */
exports.list = function(req, res) { 
	Javascript.find().sort('-created').populate('user', 'displayName').exec(function(err, javascripts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(javascripts);
		}
	});
};

/**
 * Javascript middleware
 */
exports.javascriptByID = function(req, res, next, id) { 
	Javascript.findById(id).populate('user', 'displayName').exec(function(err, javascript) {
		if (err) return next(err);
		if (! javascript) return next(new Error('Failed to load Javascript ' + id));
		req.javascript = javascript ;
		next();
	});
};

/**
 * Javascript authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.javascript.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
