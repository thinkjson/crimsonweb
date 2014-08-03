'use strict';

angular.module('crimson').controller('SettingsController', ['$scope', function($scope) {

	$scope.refresh = function() {
		localStorage.clear();
		location.reload()
	};

	$scope.fullscreen = function() {
		screenfull.toggle();
	};

}]);