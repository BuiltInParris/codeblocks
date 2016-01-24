'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Javascript Schema
 */
var JavascriptSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Javascript function name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill in the description',
		trim: true
	},
	code: {
		type: String,
		default: '',
		required: 'Please fill in the description',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Javascript', JavascriptSchema);
