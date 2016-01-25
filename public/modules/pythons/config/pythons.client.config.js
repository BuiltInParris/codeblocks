'use strict';

// Configuring the Articles module
angular.module('pythons').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Python', 'pythons', 'dropdown', '/pythons(/create)?');
		Menus.addSubMenuItem('topbar', 'pythons', 'List functions', 'pythons');
		Menus.addSubMenuItem('topbar', 'pythons', 'New function', 'pythons/create');
	}
]);