'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Javascript = mongoose.model('Javascript'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, javascript;

/**
 * Javascript routes tests
 */
describe('Javascript CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Javascript
		user.save(function() {
			javascript = {
				name: 'Javascript Name'
			};

			done();
		});
	});

	it('should be able to save Javascript instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Javascript
				agent.post('/javascripts')
					.send(javascript)
					.expect(200)
					.end(function(javascriptSaveErr, javascriptSaveRes) {
						// Handle Javascript save error
						if (javascriptSaveErr) done(javascriptSaveErr);

						// Get a list of Javascripts
						agent.get('/javascripts')
							.end(function(javascriptsGetErr, javascriptsGetRes) {
								// Handle Javascript save error
								if (javascriptsGetErr) done(javascriptsGetErr);

								// Get Javascripts list
								var javascripts = javascriptsGetRes.body;

								// Set assertions
								(javascripts[0].user._id).should.equal(userId);
								(javascripts[0].name).should.match('Javascript Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Javascript instance if not logged in', function(done) {
		agent.post('/javascripts')
			.send(javascript)
			.expect(401)
			.end(function(javascriptSaveErr, javascriptSaveRes) {
				// Call the assertion callback
				done(javascriptSaveErr);
			});
	});

	it('should not be able to save Javascript instance if no name is provided', function(done) {
		// Invalidate name field
		javascript.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Javascript
				agent.post('/javascripts')
					.send(javascript)
					.expect(400)
					.end(function(javascriptSaveErr, javascriptSaveRes) {
						// Set message assertion
						(javascriptSaveRes.body.message).should.match('Please fill Javascript name');
						
						// Handle Javascript save error
						done(javascriptSaveErr);
					});
			});
	});

	it('should be able to update Javascript instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Javascript
				agent.post('/javascripts')
					.send(javascript)
					.expect(200)
					.end(function(javascriptSaveErr, javascriptSaveRes) {
						// Handle Javascript save error
						if (javascriptSaveErr) done(javascriptSaveErr);

						// Update Javascript name
						javascript.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Javascript
						agent.put('/javascripts/' + javascriptSaveRes.body._id)
							.send(javascript)
							.expect(200)
							.end(function(javascriptUpdateErr, javascriptUpdateRes) {
								// Handle Javascript update error
								if (javascriptUpdateErr) done(javascriptUpdateErr);

								// Set assertions
								(javascriptUpdateRes.body._id).should.equal(javascriptSaveRes.body._id);
								(javascriptUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Javascripts if not signed in', function(done) {
		// Create new Javascript model instance
		var javascriptObj = new Javascript(javascript);

		// Save the Javascript
		javascriptObj.save(function() {
			// Request Javascripts
			request(app).get('/javascripts')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Javascript if not signed in', function(done) {
		// Create new Javascript model instance
		var javascriptObj = new Javascript(javascript);

		// Save the Javascript
		javascriptObj.save(function() {
			request(app).get('/javascripts/' + javascriptObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', javascript.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Javascript instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Javascript
				agent.post('/javascripts')
					.send(javascript)
					.expect(200)
					.end(function(javascriptSaveErr, javascriptSaveRes) {
						// Handle Javascript save error
						if (javascriptSaveErr) done(javascriptSaveErr);

						// Delete existing Javascript
						agent.delete('/javascripts/' + javascriptSaveRes.body._id)
							.send(javascript)
							.expect(200)
							.end(function(javascriptDeleteErr, javascriptDeleteRes) {
								// Handle Javascript error error
								if (javascriptDeleteErr) done(javascriptDeleteErr);

								// Set assertions
								(javascriptDeleteRes.body._id).should.equal(javascriptSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Javascript instance if not signed in', function(done) {
		// Set Javascript user 
		javascript.user = user;

		// Create new Javascript model instance
		var javascriptObj = new Javascript(javascript);

		// Save the Javascript
		javascriptObj.save(function() {
			// Try deleting Javascript
			request(app).delete('/javascripts/' + javascriptObj._id)
			.expect(401)
			.end(function(javascriptDeleteErr, javascriptDeleteRes) {
				// Set message assertion
				(javascriptDeleteRes.body.message).should.match('User is not logged in');

				// Handle Javascript error error
				done(javascriptDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Javascript.remove().exec();
		done();
	});
});