'use strict';

(function() {
	// Pythons Controller Spec
	describe('Pythons Controller Tests', function() {
		// Initialize global variables
		var PythonsController,
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

			// Initialize the Pythons controller.
			PythonsController = $controller('PythonsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Python object fetched from XHR', inject(function(Pythons) {
			// Create sample Python using the Pythons service
			var samplePython = new Pythons({
				name: 'New Python'
			});

			// Create a sample Pythons array that includes the new Python
			var samplePythons = [samplePython];

			// Set GET response
			$httpBackend.expectGET('pythons').respond(samplePythons);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pythons).toEqualData(samplePythons);
		}));

		it('$scope.findOne() should create an array with one Python object fetched from XHR using a pythonId URL parameter', inject(function(Pythons) {
			// Define a sample Python object
			var samplePython = new Pythons({
				name: 'New Python'
			});

			// Set the URL parameter
			$stateParams.pythonId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/pythons\/([0-9a-fA-F]{24})$/).respond(samplePython);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.python).toEqualData(samplePython);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Pythons) {
			// Create a sample Python object
			var samplePythonPostData = new Pythons({
				name: 'New Python'
			});

			// Create a sample Python response
			var samplePythonResponse = new Pythons({
				_id: '525cf20451979dea2c000001',
				name: 'New Python'
			});

			// Fixture mock form input values
			scope.name = 'New Python';

			// Set POST response
			$httpBackend.expectPOST('pythons', samplePythonPostData).respond(samplePythonResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Python was created
			expect($location.path()).toBe('/pythons/' + samplePythonResponse._id);
		}));

		it('$scope.update() should update a valid Python', inject(function(Pythons) {
			// Define a sample Python put data
			var samplePythonPutData = new Pythons({
				_id: '525cf20451979dea2c000001',
				name: 'New Python'
			});

			// Mock Python in scope
			scope.python = samplePythonPutData;

			// Set PUT response
			$httpBackend.expectPUT(/pythons\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/pythons/' + samplePythonPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid pythonId and remove the Python from the scope', inject(function(Pythons) {
			// Create new Python object
			var samplePython = new Pythons({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Pythons array and include the Python
			scope.pythons = [samplePython];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/pythons\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePython);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.pythons.length).toBe(0);
		}));
	});
}());