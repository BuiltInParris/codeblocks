'use strict';

//Setting up route
angular.module('csss').config(['$stateProvider',
	function($stateProvider) {
		// CSSs state routing
		$stateProvider.
		state('listCSSs', {
			url: '/csss',
			templateUrl: 'modules/csss/views/list-csss.client.view.html'
		}).
		state('createCSS', {
			url: '/csss/create',
			templateUrl: 'modules/csss/views/create-css.client.view.html'
		}).
		state('viewCSS', {
			url: '/csss/:cssId',
			templateUrl: 'modules/csss/views/view-css.client.view.html'
		}).
		state('editCSS', {
			url: '/csss/:cssId/edit',
			templateUrl: 'modules/csss/views/edit-css.client.view.html'
		});
	}
]);