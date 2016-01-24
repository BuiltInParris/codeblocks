'use strict';

// Configuring the Articles module
angular.module('pythons').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Pythons', 'pythons', 'dropdown', '/pythons(/create)?');
		Menus.addSubMenuItem('topbar', 'Pythons', 'List Python Functions', 'pythons');
		Menus.addSubMenuItem('topbar', 'Pythons', 'New Python', 'pythons/create');
	}
]);
