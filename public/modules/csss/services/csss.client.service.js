'use strict';

//CSSs service used to communicate CSSs REST endpoints
angular.module('csss').factory('CSSs', ['$resource',
	function($resource) {
		return $resource('csss/:cssId', { cssId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);