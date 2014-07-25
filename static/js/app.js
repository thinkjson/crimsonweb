'use strict';


// Declare app level module which depends on filters, and services
angular.module('crimson', [
    'ngRoute'
]).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider.when('/',{
        templateUrl: '/partials/start.html', 
        controller: 'StartController'
    });

    $routeProvider.when('/navigate',{
        templateUrl: '/partials/navigate.html', 
        controller: 'NavigateController'
    });

    $routeProvider.when('/read/:reference',{
        templateUrl: '/partials/reader.html', 
        controller: 'ReaderController',
        reloadOnSearch: false
    });

    $routeProvider.when('/explore/:reference',{
        templateUrl: '/partials/reader.html', 
        controller: 'ReaderController'
    });

    $routeProvider.otherwise({
        redirectTo: '/read/John 1'
    });
}])
.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function() {
        scrollTo(0,0);
    });
}]);