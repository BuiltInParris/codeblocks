'use strict';

(function() {
	// Javascripts Controller Spec
	describe('Javascripts Controller Tests', function() {
		// Initialize global variables
		var JavascriptsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Javascripts controller.
			JavascriptsController = $controller('JavascriptsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Javascript object fetched from XHR', inject(function(Javascripts) {
			// Create sample Javascript using the Javascripts service
			var sampleJavascript = new Javascripts({
				name: 'New Javascript'
			});

			// Create a sample Javascripts array that includes the new Javascript
			var sampleJavascripts = [sampleJavascript];

			// Set GET response
			$httpBackend.expectGET('javascripts').respond(sampleJavascripts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.javascripts).toEqualData(sampleJavascripts);
		}));

		it('$scope.findOne() should create an array with one Javascript object fetched from XHR using a javascriptId URL parameter', inject(function(Javascripts) {
			// Define a sample Javascript object
			var sampleJavascript = new Javascripts({
				name: 'New Javascript'
			});

			// Set the URL parameter
			$stateParams.javascriptId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/javascripts\/([0-9a-fA-F]{24})$/).respond(sampleJavascript);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.javascript).toEqualData(sampleJavascript);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Javascripts) {
			// Create a sample Javascript object
			var sampleJavascriptPostData = new Javascripts({
				name: 'New Javascript'
			});

			// Create a sample Javascript response
			var sampleJavascriptResponse = new Javascripts({
				_id: '525cf20451979dea2c000001',
				name: 'New Javascript'
			});

			// Fixture mock form input values
			scope.name = 'New Javascript';

			// Set POST response
			$httpBackend.expectPOST('javascripts', sampleJavascriptPostData).respond(sampleJavascriptResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Javascript was created
			expect($location.path()).toBe('/javascripts/' + sampleJavascriptResponse._id);
		}));

		it('$scope.update() should update a valid Javascript', inject(function(Javascripts) {
			// Define a sample Javascript put data
			var sampleJavascriptPutData = new Javascripts({
				_id: '525cf20451979dea2c000001',
				name: 'New Javascript'
			});

			// Mock Javascript in scope
			scope.javascript = sampleJavascriptPutData;

			// Set PUT response
			$httpBackend.expectPUT(/javascripts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/javascripts/' + sampleJavascriptPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid javascriptId and remove the Javascript from the scope', inject(function(Javascripts) {
			// Create new Javascript object
			var sampleJavascript = new Javascripts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Javascripts array and include the Javascript
			scope.javascripts = [sampleJavascript];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/javascripts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleJavascript);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.javascripts.length).toBe(0);
		}));
	});
}());