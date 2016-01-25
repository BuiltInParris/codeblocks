'use strict';

// Configuring the Articles module
angular.module('javascripts').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Javascript', 'javascripts', 'dropdown', '/javascripts(/create)?');
		Menus.addSubMenuItem('topbar', 'javascripts', 'List Functions', 'javascripts');
		Menus.addSubMenuItem('topbar', 'javascripts', 'New Function', 'javascripts/create');
	}
]);