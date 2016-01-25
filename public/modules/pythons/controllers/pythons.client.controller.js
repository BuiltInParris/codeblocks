'use strict';

// Pythons controller
angular.module('pythons').controller('PythonsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Pythons',
	function($scope, $stateParams, $location, Authentication, Pythons) {
		$scope.authentication = Authentication;

		// Create new Python
		$scope.create = function() {
			// Create new Python object
			var python = new Pythons ({
				name: this.name,
				description: this.description,
				code: this.code
			});

			// Redirect after save
			python.$save(function(response) {
				$location.path('pythons/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Python
		$scope.remove = function(python) {
			if ( python ) { 
				python.$remove();

				for (var i in $scope.pythons) {
					if ($scope.pythons [i] === python) {
						$scope.pythons.splice(i, 1);
					}
				}
			} else {
				$scope.python.$remove(function() {
					$location.path('pythons');
				});
			}
		};

		// Update existing Python
		$scope.update = function() {
			var python = $scope.python;

			python.$update(function() {
				$location.path('pythons/' + python._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Pythons
		$scope.find = function() {
			$scope.pythons = Pythons.query();
		};
	
		$scope.codeBox = '//Here\'s where the Python code will appear! Select something on the right!';
		$scope.descriptionBox = 'Here\'s where the description will appear.';
		
		$scope.selectedFunction = '';	
		$scope.changeFunction = function(code, description) {
			$scope.codeBox = code;	
			$scope.descriptionBox = description;
		};
		
		// Find existing Python
		$scope.findOne = function() {
			$scope.python = Pythons.get({ 
				pythonId: $stateParams.pythonId
			});
		};
	}
]);
