'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ObjectiveC = mongoose.model('ObjectiveC'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, objectivec;

/**
 * ObjectiveC routes tests
 */
describe('ObjectiveC CRUD tests', function() {
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

		// Save a user to the test db and create new ObjectiveC
		user.save(function() {
			objectivec = {
				name: 'ObjectiveC Name'
			};

			done();
		});
	});

	it('should be able to save ObjectiveC instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new ObjectiveC
				agent.post('/objectivecs')
					.send(objectivec)
					.expect(200)
					.end(function(objectivecSaveErr, objectivecSaveRes) {
						// Handle ObjectiveC save error
						if (objectivecSaveErr) done(objectivecSaveErr);

						// Get a list of ObjectiveCs
						agent.get('/objectivecs')
							.end(function(objectivecsGetErr, objectivecsGetRes) {
								// Handle ObjectiveC save error
								if (objectivecsGetErr) done(objectivecsGetErr);

								// Get ObjectiveCs list
								var objectivecs = objectivecsGetRes.body;

								// Set assertions
								(objectivecs[0].user._id).should.equal(userId);
								(objectivecs[0].name).should.match('ObjectiveC Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save ObjectiveC instance if not logged in', function(done) {
		agent.post('/objectivecs')
			.send(objectivec)
			.expect(401)
			.end(function(objectivecSaveErr, objectivecSaveRes) {
				// Call the assertion callback
				done(objectivecSaveErr);
			});
	});

	it('should not be able to save ObjectiveC instance if no name is provided', function(done) {
		// Invalidate name field
		objectivec.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new ObjectiveC
				agent.post('/objectivecs')
					.send(objectivec)
					.expect(400)
					.end(function(objectivecSaveErr, objectivecSaveRes) {
						// Set message assertion
						(objectivecSaveRes.body.message).should.match('Please fill ObjectiveC name');
						
						// Handle ObjectiveC save error
						done(objectivecSaveErr);
					});
			});
	});

	it('should be able to update ObjectiveC instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new ObjectiveC
				agent.post('/objectivecs')
					.send(objectivec)
					.expect(200)
					.end(function(objectivecSaveErr, objectivecSaveRes) {
						// Handle ObjectiveC save error
						if (objectivecSaveErr) done(objectivecSaveErr);

						// Update ObjectiveC name
						objectivec.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing ObjectiveC
						agent.put('/objectivecs/' + objectivecSaveRes.body._id)
							.send(objectivec)
							.expect(200)
							.end(function(objectivecUpdateErr, objectivecUpdateRes) {
								// Handle ObjectiveC update error
								if (objectivecUpdateErr) done(objectivecUpdateErr);

								// Set assertions
								(objectivecUpdateRes.body._id).should.equal(objectivecSaveRes.body._id);
								(objectivecUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of ObjectiveCs if not signed in', function(done) {
		// Create new ObjectiveC model instance
		var objectivecObj = new ObjectiveC(objectivec);

		// Save the ObjectiveC
		objectivecObj.save(function() {
			// Request ObjectiveCs
			request(app).get('/objectivecs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single ObjectiveC if not signed in', function(done) {
		// Create new ObjectiveC model instance
		var objectivecObj = new ObjectiveC(objectivec);

		// Save the ObjectiveC
		objectivecObj.save(function() {
			request(app).get('/objectivecs/' + objectivecObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', objectivec.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete ObjectiveC instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new ObjectiveC
				agent.post('/objectivecs')
					.send(objectivec)
					.expect(200)
					.end(function(objectivecSaveErr, objectivecSaveRes) {
						// Handle ObjectiveC save error
						if (objectivecSaveErr) done(objectivecSaveErr);

						// Delete existing ObjectiveC
						agent.delete('/objectivecs/' + objectivecSaveRes.body._id)
							.send(objectivec)
							.expect(200)
							.end(function(objectivecDeleteErr, objectivecDeleteRes) {
								// Handle ObjectiveC error error
								if (objectivecDeleteErr) done(objectivecDeleteErr);

								// Set assertions
								(objectivecDeleteRes.body._id).should.equal(objectivecSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete ObjectiveC instance if not signed in', function(done) {
		// Set ObjectiveC user 
		objectivec.user = user;

		// Create new ObjectiveC model instance
		var objectivecObj = new ObjectiveC(objectivec);

		// Save the ObjectiveC
		objectivecObj.save(function() {
			// Try deleting ObjectiveC
			request(app).delete('/objectivecs/' + objectivecObj._id)
			.expect(401)
			.end(function(objectivecDeleteErr, objectivecDeleteRes) {
				// Set message assertion
				(objectivecDeleteRes.body.message).should.match('User is not logged in');

				// Handle ObjectiveC error error
				done(objectivecDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ObjectiveC.remove().exec();
		done();
	});
});