'use strict';

// CSSs controller
angular.module('csss').controller('CSSsController', ['$scope', '$stateParams', '$location', 'Authentication', 'CSSs',
	function($scope, $stateParams, $location, Authentication, CSSs) {
		$scope.authentication = Authentication;

		// Create new CSS
		$scope.create = function() {
			// Create new CSS object
			var css = new CSSs ({
				name: this.name,
				description: this.description,
				code: this.code
			});

			// Redirect after save
			css.$save(function(response) {
				$location.path('csss/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing CSS
		$scope.remove = function(css) {
			if ( css ) { 
				css.$remove();

				for (var i in $scope.csss) {
					if ($scope.csss [i] === css) {
						$scope.csss.splice(i, 1);
					}
				}
			} else {
				$scope.css.$remove(function() {
					$location.path('csss');
				});
			}
		};

		// Update existing CSS
		$scope.update = function() {
			var css = $scope.css;

			css.$update(function() {
				$location.path('csss/' + css._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of CSSs
		$scope.find = function() {
			$scope.csss = CSSs.query();
		};
	
		$scope.codeBox = '/*Here\'s where the CSS code will appear! Select something on the right!*/';
		$scope.descriptionBox = 'Here\'s where the description will appear.';
		
		$scope.selectedFunction = '';	
		$scope.changeFunction = function(code, description) {
			$scope.codeBox = code;	
			$scope.descriptionBox = description;
		};
		
		// Find existing CSS
		$scope.findOne = function() {
			$scope.css = CSSs.get({ 
				cssId: $stateParams.cssId
			});
		};
	}
]);
/*
angular.module('csss').directive('highlight', function($interpolate, $window){
    return {
    restrict: 'EA',
    scope: true,
    compile: function (tElem, tAttrs) {
      var interpolateFn = $interpolate(tElem.html(), true);
      tElem.html(''); // stop automatic intepolation

      return function(scope, elem, attrs){
        scope.$watch(interpolateFn, function (value) {
          elem.html(hljs.highlight('css',value).value);
        });
      }
    }
  };
});
*/
/*
angular.module('csss').directive('prettify', ['$compile', '$timeout', function ($compile, $timeout) {
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
}]);
*/
