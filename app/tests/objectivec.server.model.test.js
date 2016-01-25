'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ObjectiveC = mongoose.model('ObjectiveC');

/**
 * Globals
 */
var user, objectivec;

/**
 * Unit tests
 */
describe('ObjectiveC Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			objectivec = new ObjectiveC({
				name: 'ObjectiveC Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return objectivec.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			objectivec.name = '';

			return objectivec.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ObjectiveC.remove().exec();
		User.remove().exec();

		done();
	});
});