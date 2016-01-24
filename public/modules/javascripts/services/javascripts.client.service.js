'use strict';

//Javascripts service used to communicate Javascripts REST endpoints
angular.module('javascripts').factory('Javascripts', ['$resource',
	function($resource) {
		return $resource('javascripts/:javascriptId', { javascriptId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);