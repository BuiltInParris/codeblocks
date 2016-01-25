'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	CSS = mongoose.model('CSS'),
	_ = require('lodash');

/**
 * Create a CSS
 */
exports.create = function(req, res) {
	var css = new CSS(req.body);
	css.user = req.user;

	css.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(css);
		}
	});
};

/**
 * Show the current CSS
 */
exports.read = function(req, res) {
	res.jsonp(req.css);
};

/**
 * Update a CSS
 */
exports.update = function(req, res) {
	var css = req.css ;

	css = _.extend(css , req.body);

	css.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(css);
		}
	});
};

/**
 * Delete an CSS
 */
exports.delete = function(req, res) {
	var css = req.css ;

	css.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(css);
		}
	});
};

/**
 * List of CSSs
 */
exports.list = function(req, res) { 
	CSS.find().sort('-created').populate('user', 'displayName').exec(function(err, csss) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(csss);
		}
	});
};

/**
 * CSS middleware
 */
exports.cssByID = function(req, res, next, id) { 
	CSS.findById(id).populate('user', 'displayName').exec(function(err, css) {
		if (err) return next(err);
		if (! css) return next(new Error('Failed to load CSS ' + id));
		req.css = css ;
		next();
	});
};

/**
 * CSS authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.css.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
