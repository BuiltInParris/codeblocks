
'use strict';

// Setting up route
angular.module('language').config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
                // Redirect to home view when route not found
                $urlRouterProvider.otherwise('/');

                // Home state routing
                $stateProvider.
                state('language_home', {
                        url: '/language',
                        templateUrl: 'modules/language/views/home.client.view.html'
                }).
                state('javascript_home', {
                        url: '/javascriptfunction',
                        templateUrl: 'modules/language/views/javascriptfunction.client.view.html'
                });
        }
]);
