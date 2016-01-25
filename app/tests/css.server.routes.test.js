'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	CSS = mongoose.model('CSS'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, css;

/**
 * CSS routes tests
 */
describe('CSS CRUD tests', function() {
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

		// Save a user to the test db and create new CSS
		user.save(function() {
			css = {
				name: 'CSS Name'
			};

			done();
		});
	});

	it('should be able to save CSS instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new CSS
				agent.post('/csss')
					.send(css)
					.expect(200)
					.end(function(cssSaveErr, cwwSaveRes) {
						// Handle CSS save error
						if (cssSaveErr) done(cssSaveErr);

						// Get a list of CSS
						agent.get('/csss')
							.end(function(csssGetErr, csssGetRes) {
								// Handle CSS save error
								if (csssGetErr) done(csssGetErr);

								// Get CSS list
								var csss = csssGetRes.body;

								// Set assertions
								(csss[0].user._id).should.equal(userId);
								(csss[0].name).should.match('CSS Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save CSS instance if not logged in', function(done) {
		agent.post('/csss')
			.send(css)
			.expect(401)
			.end(function(cssSaveErr, cssSaveRes) {
				// Call the assertion callback
				done(cssSaveErr);
			});
	});

	it('should not be able to save CSS instance if no name is provided', function(done) {
		// Invalidate name field
		css.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new CSS
				agent.post('/csss')
					.send(css)
					.expect(400)
					.end(function(cssSaveErr, cssSaveRes) {
						// Set message assertion
						(cssSaveRes.body.message).should.match('Please fill CSS name');
						
						// Handle CSS save error
						done(cssSaveErr);
					});
			});
	});

	it('should be able to update CSS instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new CSS
				agent.post('/csss')
					.send(css)
					.expect(200)
					.end(function(cssSaveErr, cssSaveRes) {
						// Handle CSS save error
						if (cssSaveErr) done(cssSaveErr);

						// Update CSS name
						css.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing CSS
						agent.put('/csss/' + cssSaveRes.body._id)
							.send(css)
							.expect(200)
							.end(function(cssUpdateErr, cssUpdateRes) {
								// Handle CSS update error
								if (cssUpdateErr) done(cssUpdateErr);

								// Set assertions
								(cssUpdateRes.body._id).should.equal(cssSaveRes.body._id);
								(cssUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of CSSs if not signed in', function(done) {
		// Create new CSS model instance
		var cssObj = new CSS(css);

		// Save the CSS
		cssObj.save(function() {
			// Request CSSs
			request(app).get('/csss')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single CSS if not signed in', function(done) {
		// Create new CSS model instance
		var cssObj = new CSS(css);

		// Save the CSS
		cssObj.save(function() {
			request(app).get('/csss/' + cssObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', css.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete CSS instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new CSS
				agent.post('/csss')
					.send(css)
					.expect(200)
					.end(function(cssSaveErr, cssSaveRes) {
						// Handle CSS save error
						if (cssSaveErr) done(cssSaveErr);

						// Delete existing CSS
						agent.delete('/csss/' + cssSaveRes.body._id)
							.send(css)
							.expect(200)
							.end(function(cssDeleteErr, cssDeleteRes) {
								// Handle CSS error error
								if (cssDeleteErr) done(cssDeleteErr);

								// Set assertions
								(cssDeleteRes.body._id).should.equal(cssSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete CSS instance if not signed in', function(done) {
		// Set CSS user 
		css.user = user;

		// Create new CSS model instance
		var cssObj = new CSS(css);

		// Save the CSS
		cssObj.save(function() {
			// Try deleting CSS
			request(app).delete('/csss/' + cssObj._id)
			.expect(401)
			.end(function(cssDeleteErr, cssDeleteRes) {
				// Set message assertion
				(cssDeleteRes.body.message).should.match('User is not logged in');

				// Handle CSS error error
				done(cssDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		CSS.remove().exec();
		done();
	});
});
