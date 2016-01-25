'use strict';

//ObjectiveCs service used to communicate Javascripts REST endpoints
angular.module('objectivecs').factory('ObjectiveCs', ['$resource',
	function($resource) {
		return $resource('objectivecs/:objectivecId', { objectivecId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
