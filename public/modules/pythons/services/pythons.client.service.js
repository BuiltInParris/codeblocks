'use strict';

//Pythons service used to communicate Javascripts REST endpoints
angular.module('pythons').factory('Pythons', ['$resource',
	function($resource) {
		return $resource('pythons/:pythonId', { pythonId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
