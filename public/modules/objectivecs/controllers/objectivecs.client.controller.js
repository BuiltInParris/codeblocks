'use strict';

// ObjectiveCs controller
angular.module('objectivecs').controller('ObjectiveCsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ObjectiveCs',
	function($scope, $stateParams, $location, Authentication, ObjectiveCs) {
		$scope.authentication = Authentication;

		// Create new ObjectiveC
		$scope.create = function() {
			// Create new ObjectiveC object
			var objectivec = new ObjectiveCs ({
				name: this.name,
				description: this.description,
				code: this.code
			});

			// Redirect after save
			objectivec.$save(function(response) {
				$location.path('objectivecs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing ObjectiveC
		$scope.remove = function(objectivec) {
			if ( objectivec ) { 
				objectivec.$remove();

				for (var i in $scope.objectivecs) {
					if ($scope.objectivecs [i] === objectivec) {
						$scope.objectivecs.splice(i, 1);
					}
				}
			} else {
				$scope.objectivec.$remove(function() {
					$location.path('objectivecs');
				});
			}
		};

		// Update existing ObjectiveC
		$scope.update = function() {
			var objectivec = $scope.objectivec;

			objectivec.$update(function() {
				$location.path('objectivecs/' + objectivec._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of ObjectiveCs
		$scope.find = function() {
			$scope.objectivecs = ObjectiveCs.query();
		};

		$scope.codeBox = '//Here\'s where the ObjectiveC code will appear! Select something on the right!';
		$scope.descriptionBox = 'Here\'s where the description will appear.';
		
		$scope.selectedFunction = '';	
		$scope.changeFunction = function(code, description) {
			$scope.codeBox = code;	
			$scope.descriptionBox = description;
		};
		
		// Find existing ObjectiveC
		$scope.findOne = function() {
			$scope.objectivec = ObjectiveCs.get({ 
				objectivecId: $stateParams.objectivecId
			});
		};
	}
]);
/*
angular.module('objectivecs').directive('prettify', ['$compile', '$timeout', function ($compile, $timeout) {
    return {
        restrict: 'E',
        scope: {
            target: '='
        },
        link: function (scope, element, attrs) {
            var template = element.html();
            var templateFn = $compile(template);
            var update = function(){
                $timeout(function () {
                    var compiled = templateFn(scope).html();
                    var prettified = prettyPrintOne(compiled); // jshint ignore:line
                    element.html(prettified);
                }, 0);
            };
            scope.$watch('target', function () {
                update();
            }, true);
            update();
        }
    };
}]);*/
