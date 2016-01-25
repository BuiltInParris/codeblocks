'use strict';

//Setting up route
angular.module('objectivecs').config(['$stateProvider',
	function($stateProvider) {
		// ObjectiveCs state routing
		$stateProvider.
		state('listObjectiveCs', {
			url: '/objectivecs',
			templateUrl: 'modules/objectivecs/views/list-objectivecs.client.view.html'
		}).
		state('createObjectiveC', {
			url: '/objectivecs/create',
			templateUrl: 'modules/objectivecs/views/create-objectivec.client.view.html'
		}).
		state('viewObjectiveC', {
			url: '/objectivecs/:objectivecId',
			templateUrl: 'modules/objectivecs/views/view-objectivec.client.view.html'
		}).
		state('editObjectiveC', {
			url: '/objectivecs/:objectivecId/edit',
			templateUrl: 'modules/objectivecs/views/edit-objectivec.client.view.html'
		});
	}
]);
