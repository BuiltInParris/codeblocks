'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Python = mongoose.model('Python'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, python;

/**
 * Python routes tests
 */
describe('Python CRUD tests', function() {
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

		// Save a user to the test db and create new Python
		user.save(function() {
			python = {
				name: 'Python Name'
			};

			done();
		});
	});

	it('should be able to save Python instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Python
				agent.post('/pythons')
					.send(python)
					.expect(200)
					.end(function(pythonSaveErr, pythonSaveRes) {
						// Handle Python save error
						if (pythonSaveErr) done(pythonSaveErr);

						// Get a list of Pythons
						agent.get('/pythons')
							.end(function(pythonsGetErr, pythonsGetRes) {
								// Handle Python save error
								if (pythonsGetErr) done(pythonsGetErr);

								// Get Pythons list
								var pythons = pythonsGetRes.body;

								// Set assertions
								(pythons[0].user._id).should.equal(userId);
								(pythons[0].name).should.match('Python Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Python instance if not logged in', function(done) {
		agent.post('/pythons')
			.send(python)
			.expect(401)
			.end(function(pythonSaveErr, pythonSaveRes) {
				// Call the assertion callback
				done(pythonSaveErr);
			});
	});

	it('should not be able to save Python instance if no name is provided', function(done) {
		// Invalidate name field
		python.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Python
				agent.post('/pythons')
					.send(python)
					.expect(400)
					.end(function(pythonSaveErr, pythonSaveRes) {
						// Set message assertion
						(pythonSaveRes.body.message).should.match('Please fill Python name');
						
						// Handle Python save error
						done(pythonSaveErr);
					});
			});
	});

	it('should be able to update Python instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Python
				agent.post('/pythons')
					.send(python)
					.expect(200)
					.end(function(pythonSaveErr, pythonSaveRes) {
						// Handle Python save error
						if (pythonSaveErr) done(pythonSaveErr);

						// Update Python name
						python.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Python
						agent.put('/pythons/' + pythonSaveRes.body._id)
							.send(python)
							.expect(200)
							.end(function(pythonUpdateErr, pythonUpdateRes) {
								// Handle Python update error
								if (pythonUpdateErr) done(pythonUpdateErr);

								// Set assertions
								(pythonUpdateRes.body._id).should.equal(pythonSaveRes.body._id);
								(pythonUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Pythons if not signed in', function(done) {
		// Create new Python model instance
		var pythonObj = new Python(python);

		// Save the Python
		pythonObj.save(function() {
			// Request Pythons
			request(app).get('/pythons')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Python if not signed in', function(done) {
		// Create new Python model instance
		var pythonObj = new Python(python);

		// Save the Python
		pythonObj.save(function() {
			request(app).get('/pythons/' + pythonObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', python.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Python instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Python
				agent.post('/pythons')
					.send(python)
					.expect(200)
					.end(function(pythonSaveErr, pythonSaveRes) {
						// Handle Python save error
						if (pythonSaveErr) done(pythonSaveErr);

						// Delete existing Python
						agent.delete('/pythons/' + pythonSaveRes.body._id)
							.send(python)
							.expect(200)
							.end(function(pythonDeleteErr, pythonDeleteRes) {
								// Handle Python error error
								if (pythonDeleteErr) done(pythonDeleteErr);

								// Set assertions
								(pythonDeleteRes.body._id).should.equal(pythonSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Python instance if not signed in', function(done) {
		// Set Python user 
		python.user = user;

		// Create new Python model instance
		var pythonObj = new Python(python);

		// Save the Python
		pythonObj.save(function() {
			// Try deleting Python
			request(app).delete('/pythons/' + pythonObj._id)
			.expect(401)
			.end(function(pythonDeleteErr, pythonDeleteRes) {
				// Set message assertion
				(pythonDeleteRes.body.message).should.match('User is not logged in');

				// Handle Python error error
				done(pythonDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Python.remove().exec();
		done();
	});
});
