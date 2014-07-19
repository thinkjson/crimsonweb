'use strict';

angular.module('crimson').service('ReaderService', ['$http', function($http) {
	this.get = function(reference) {
		return $http({
			method: 'GET',
			url: '/api/read/' + reference
		});
	};
}]);