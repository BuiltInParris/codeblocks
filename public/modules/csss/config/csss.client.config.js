'use strict';

// Configuring the Articles module
angular.module('csss').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'CSS', 'csss', 'dropdown', '/csss(/create)?');
		Menus.addSubMenuItem('topbar', 'csss', 'List functions', 'csss');
		Menus.addSubMenuItem('topbar', 'csss', 'New function', 'csss/create');
	}
]);