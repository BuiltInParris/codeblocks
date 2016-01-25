'use strict';

(function() {
	// CSSs Controller Spec
	describe('CSSs Controller Tests', function() {
		// Initialize global variables
		var CSSsController,
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

			// Initialize the CSSs controller.
			CSSsController = $controller('CSSsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one CSS object fetched from XHR', inject(function(CSSs) {
			// Create sample CSS using the CSSs service
			var sampleCSS = new CSSs({
				name: 'New CSS'
			});

			// Create a sample CSSs array that includes the new CSS
			var sampleCSSs = [sampleCSS];

			// Set GET response
			$httpBackend.expectGET('csss').respond(sampleCSSs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.csss).toEqualData(sampleCSSs);
		}));

		it('$scope.findOne() should create an array with one CSS object fetched from XHR using a cssId URL parameter', inject(function(CSSs) {
			// Define a sample CSS object
			var sampleCSS = new CSSs({
				name: 'New CSS'
			});

			// Set the URL parameter
			$stateParams.cssId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/csss\/([0-9a-fA-F]{24})$/).respond(sampleCSS);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.css).toEqualData(sampleCSS);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(CSSs) {
			// Create a sample CSS object
			var sampleCSSPostData = new CSSs({
				name: 'New CSS'
			});

			// Create a sample CSS response
			var sampleCSSResponse = new CSSs({
				_id: '525cf20451979dea2c000001',
				name: 'New CSS'
			});

			// Fixture mock form input values
			scope.name = 'New CSS';

			// Set POST response
			$httpBackend.expectPOST('csss', sampleCSSPostData).respond(sampleCSSResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the CSS was created
			expect($location.path()).toBe('/csss/' + sampleCSSResponse._id);
		}));

		it('$scope.update() should update a valid CSS', inject(function(CSSs) {
			// Define a sample CSS put data
			var sampleCSSPutData = new CSSs({
				_id: '525cf20451979dea2c000001',
				name: 'New CSS'
			});

			// Mock CSS in scope
			scope.css = sampleCSSPutData;

			// Set PUT response
			$httpBackend.expectPUT(/csss\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/csss/' + sampleCSSPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid cssId and remove the CSS from the scope', inject(function(CSSs) {
			// Create new CSS object
			var sampleCSS = new CSSs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new CSSs array and include the CSS
			scope.csss = [sampleCSS];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/csss\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCSS);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.csss.length).toBe(0);
		}));
	});
}());