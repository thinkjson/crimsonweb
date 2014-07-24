'use strict';

angular.module('crimson').controller('StartController', ['$scope', '$routeParams', '$sce', 'NavigateService', function($scope, $routeParams, $sce, NavigateService) {
	NavigateService.random('Poetry and Wisdom').then(function(reference) {
		$scope.randomWisdom = reference;
	});

	NavigateService.random('Gospels and Acts').then(function(reference) {
		$scope.randomGospel = reference;
	});

	NavigateService.random('Epistles').then(function(reference) {
		$scope.randomEpistle = reference;
	});
}]);