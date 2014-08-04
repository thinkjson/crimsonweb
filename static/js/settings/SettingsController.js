'use strict';

angular.module('crimson').controller('SettingsController', ['$scope', function($scope) {

	$scope.refresh = function() {
		localStorage.clear();
		location.reload()
	};

	$scope.fullscreen = function() {
		screenfull.toggle();
	};

	$scope.decreaseFont = function() {
		localStorage.fontSize = parseInt(localStorage.fontSize ? localStorage.fontSize : 18) - 2;
	}

	$scope.increaseFont = function() {
		localStorage.fontSize = parseInt(localStorage.fontSize ? localStorage.fontSize : 18) + 2;
	}

	$scope.toggleVerseNumbers = function() {
		localStorage.hideVerseNumbers = localStorage.hideVerseNumbers === 'true' ? 'false' : 'true';
	}

}]);