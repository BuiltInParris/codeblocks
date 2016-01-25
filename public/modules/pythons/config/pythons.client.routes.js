'use strict';

//Setting up route
angular.module('pythons').config(['$stateProvider',
	function($stateProvider) {
		// Pythons state routing
		$stateProvider.
		state('listPythons', {
			url: '/pythons',
			templateUrl: 'modules/pythons/views/list-pythons.client.view.html'
		}).
		state('createPython', {
			url: '/pythons/create',
			templateUrl: 'modules/pythons/views/create-python.client.view.html'
		}).
		state('viewPython', {
			url: '/pythons/:pythonId',
			templateUrl: 'modules/pythons/views/view-python.client.view.html'
		}).
		state('editPython', {
			url: '/pythons/:pythonId/edit',
			templateUrl: 'modules/pythons/views/edit-python.client.view.html'
		});
	}
]);