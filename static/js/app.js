'use strict';


// Declare app level module which depends on filters, and services
angular.module('crimson', [
    'ngRoute'
]).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider.when('/read/:reference',{
        templateUrl: '/partials/reader.html', 
        controller: 'ReaderController'
    });

    $routeProvider.otherwise({
        redirectTo: '/read/John 1'
    });
}]);