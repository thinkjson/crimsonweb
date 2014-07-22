'use strict';

angular.module('crimson').service('NavigateService', ['$http', function($http) {
	this.get = function(reference) {
		return $http({
			method: 'GET',
			url: '/api/books'
		});
	};
}]);