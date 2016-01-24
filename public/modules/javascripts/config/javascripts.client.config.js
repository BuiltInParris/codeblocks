'use strict';

// Configuring the Articles module
angular.module('javascripts').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Javascripts', 'javascripts', 'dropdown', '/javascripts(/create)?');
		Menus.addSubMenuItem('topbar', 'javascripts', 'List Javascripts', 'javascripts');
		Menus.addSubMenuItem('topbar', 'javascripts', 'New Javascript', 'javascripts/create');
	}
]);