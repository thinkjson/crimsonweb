'use strict';

angular.module('crimson').service('ReaderService', ['$http', '$q', function($http, $q) {
	var expired = function(cacheTime) {
		var timeSinceIngest = (new Date()).getTime() - parseInt(cacheTime);
		if (timeSinceIngest > 86400000) {
			return true;
		}

		return false;
	}

	this.get = function(reference) {
		var deferred = $q.defer();

		// Attempt to fetch passage out of localStorage
		var cached = null;
		try {
			cached = JSON.parse(localStorage['passage_' + reference]);
		} catch (e) {}

		// If not available, hit the API
		if (cached) {
			deferred.resolve(cached);
		}

		if (! cached || ! cached.data.fetched || expired(cached.data.fetched)) {
			$http({
				method: 'GET',
				url: '/api/read/' + reference
			}).then(function(response) {
				localStorage['passage_' + reference] = JSON.stringify(response);
				deferred.resolve(response);
			}, function() {
				deferred.reject();
			});
		}

		return deferred.promise;
	};
}]);