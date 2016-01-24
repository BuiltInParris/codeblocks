'use strict';

// Javascripts controller
angular.module('javascripts').controller('JavascriptsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Javascripts',
	function($scope, $stateParams, $location, Authentication, Javascripts) {
		$scope.authentication = Authentication;

		// Create new Javascript
		$scope.create = function() {
			// Create new Javascript object
			var javascript = new Javascripts ({
				name: this.name,
				description: this.description,
				code: this.code
			});

			// Redirect after save
			javascript.$save(function(response) {
				$location.path('javascripts/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Javascript
		$scope.remove = function(javascript) {
			if ( javascript ) { 
				javascript.$remove();

				for (var i in $scope.javascripts) {
					if ($scope.javascripts [i] === javascript) {
						$scope.javascripts.splice(i, 1);
					}
				}
			} else {
				$scope.javascript.$remove(function() {
					$location.path('javascripts');
				});
			}
		};

		// Update existing Javascript
		$scope.update = function() {
			var javascript = $scope.javascript;

			javascript.$update(function() {
				$location.path('javascripts/' + javascript._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Javascripts
		$scope.find = function() {
			$scope.javascripts = Javascripts.query();
		};
	
		$scope.codeBox = '//Here\'s where the Javascript code will appear! Select something on the right!';
		$scope.descriptionBox = '//Here\'s where the description will appear.';
		
		$scope.selectedFunction = '';	
		$scope.changeFunction = function(code, description) {
			$scope.codeBox = code;	
			$scope.descriptionBox = description;
		};
		
		// Find existing Javascript
		$scope.findOne = function() {
			$scope.javascript = Javascripts.get({ 
				javascriptId: $stateParams.javascriptId
			});
		};
	}
]);
/*
angular.module('javascripts').directive('highlight', function($interpolate, $window){
    return {
    restrict: 'EA',
    scope: true,
    compile: function (tElem, tAttrs) {
      var interpolateFn = $interpolate(tElem.html(), true);
      tElem.html(''); // stop automatic intepolation

      return function(scope, elem, attrs){
        scope.$watch(interpolateFn, function (value) {
          elem.html(hljs.highlight('javascript',value).value);
        });
      }
    }
  };
});
*/

angular.module('javascripts').directive('prettify', ['$compile', '$timeout', function ($compile, $timeout) {
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

