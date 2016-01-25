'use strict';

(function() {
	// ObjectiveCs Controller Spec
	describe('ObjectiveCs Controller Tests', function() {
		// Initialize global variables
		var ObjectiveCsController,
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

			// Initialize the ObjectiveCs controller.
			ObjectiveCsController = $controller('ObjectiveCsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one ObjectiveC object fetched from XHR', inject(function(ObjectiveCs) {
			// Create sample ObjectiveC using the ObjectiveCs service
			var sampleObjectiveC = new ObjectiveCs({
				name: 'New ObjectiveC'
			});

			// Create a sample ObjectiveCs array that includes the new ObjectiveC
			var sampleObjectiveCs = [sampleObjectiveC];

			// Set GET response
			$httpBackend.expectGET('objectivecs').respond(sampleObjectiveCs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.objectivecs).toEqualData(sampleObjectiveCs);
		}));

		it('$scope.findOne() should create an array with one ObjectiveC object fetched from XHR using a objectivecId URL parameter', inject(function(ObjectiveCs) {
			// Define a sample ObjectiveC object
			var sampleObjectiveC = new ObjectiveCs({
				name: 'New ObjectiveC'
			});

			// Set the URL parameter
			$stateParams.objectivecId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/objectivecs\/([0-9a-fA-F]{24})$/).respond(sampleObjectiveC);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.objectivec).toEqualData(sampleObjectiveC);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ObjectiveCs) {
			// Create a sample ObjectiveC object
			var sampleObjectiveCPostData = new ObjectiveCs({
				name: 'New ObjectiveC'
			});

			// Create a sample ObjectiveC response
			var sampleObjectiveCResponse = new ObjectiveCs({
				_id: '525cf20451979dea2c000001',
				name: 'New ObjectiveC'
			});

			// Fixture mock form input values
			scope.name = 'New ObjectiveC';

			// Set POST response
			$httpBackend.expectPOST('objectivecs', sampleObjectiveCPostData).respond(sampleObjectiveCResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the ObjectiveC was created
			expect($location.path()).toBe('/objectivecs/' + sampleObjectiveCResponse._id);
		}));

		it('$scope.update() should update a valid ObjectiveC', inject(function(ObjectiveCs) {
			// Define a sample ObjectiveC put data
			var sampleObjectiveCPutData = new ObjectiveCs({
				_id: '525cf20451979dea2c000001',
				name: 'New ObjectiveC'
			});

			// Mock ObjectiveC in scope
			scope.objectivec = sampleObjectiveCPutData;

			// Set PUT response
			$httpBackend.expectPUT(/objectivecs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/objectivecs/' + sampleObjectiveCPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid objectivecId and remove the ObjectiveC from the scope', inject(function(ObjectiveCs) {
			// Create new ObjectiveC object
			var sampleObjectiveC = new ObjectiveCs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new ObjectiveCs array and include the ObjectiveC
			scope.objectivecs = [sampleObjectiveC];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/objectivecs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleObjectiveC);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.objectivecs.length).toBe(0);
		}));
	});
}());
