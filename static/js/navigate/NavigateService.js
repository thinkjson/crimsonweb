'use strict';

angular.module('crimson').service('NavigateService', ['$http', '$q', function($http, $q) {
	var books = null;
	var flatBooks = [];

	this.get = function() {
		var deferred = $q.defer();

		if (! books) {
			$http({
				method: 'GET',
				url: '/api/books'
			}).then(function(response) {
				// Cache nested book list
				books = response;

				// Cache flat book list
				_.forEach(response.data.categories, function(category) {
					_.forEach(category.books, function(book) {
						flatBooks.push(book);
					});
				});

				deferred.resolve(response);
			}, function(response) {
				deferred.reject(response);
			})
		} else {
			deferred.resolve(books)
		}

		return deferred.promise;
	};

	this.next = function(reference) {
		var deferred = $q.defer();
		this.get().then(function(books) {
			var matches = reference.match(/(.*) (\d+)/);
			var book = _.findIndex(flatBooks, {name: matches[1]});
			var chapter = parseInt(matches[2]);

			if (chapter < flatBooks[book].chapters) {
				deferred.resolve(matches[1] + ' ' + (chapter + 1));
			} else {
				deferred.resolve(flatBooks[(book + 1) % flatBooks.length].name + ' ' + 1);
			}
		}, function() {
			deferred.resolve('John 1');
		});

		return deferred.promise;
	}
}]);