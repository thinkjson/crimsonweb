'use strict';

angular.module('crimson').controller('NavigateController', ['$scope', 'NavigateService', function($scope, NavigateService) {
	$scope.books = [];
	$scope.error = null;
	$scope._ = _;

	$scope.selected = {
		category: null,
		book: null
	}

	$scope.select = function(which, i) {
		if (which === 'category') {
			$scope.selected.book = null;
		}

		if ($scope.selected[which] === i) {
			$scope.selected[which] = null;
		} else {
			$scope.selected[which] = i;
		}
	}

	NavigateService.get().then(function(response) {
		$scope.books = response.data;
	}, function() {
		$scope.error = 'Could not fetch books';
	})
}]);