'use strict';

//Setting up route
angular.module('javascripts').config(['$stateProvider',
	function($stateProvider) {
		// Javascripts state routing
		$stateProvider.
		state('listJavascripts', {
			url: '/javascripts',
			templateUrl: 'modules/javascripts/views/list-javascripts.client.view.html'
		}).
		state('createJavascript', {
			url: '/javascripts/create',
			templateUrl: 'modules/javascripts/views/create-javascript.client.view.html'
		}).
		state('viewJavascript', {
			url: '/javascripts/:javascriptId',
			templateUrl: 'modules/javascripts/views/view-javascript.client.view.html'
		}).
		state('editJavascript', {
			url: '/javascripts/:javascriptId/edit',
			templateUrl: 'modules/javascripts/views/edit-javascript.client.view.html'
		});
	}
]);