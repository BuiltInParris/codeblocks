'use strict';

// Configuring the Articles module
angular.module('objectivecs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Objective-C', 'objectivecs', 'dropdown', '/objectivecs(/create)?');
		Menus.addSubMenuItem('topbar', 'objectivecs', 'List Functions', 'objectivecs');
		Menus.addSubMenuItem('topbar', 'objectivecs', 'New Function', 'objectivecs/create');
	}
]);
