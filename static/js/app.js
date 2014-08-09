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

    $rootScope.localStorage = localStorage;
}]);

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

angular.module('crimson').controller('ReaderController', ['$scope', '$routeParams', '$sce', 'ReaderService', 'NavigateService', function($scope, $routeParams, $sce, ReaderService, NavigateService) {
    $scope.reference = $routeParams.reference;
    $scope.passage = {};
    $scope.error = null;

    $scope.text = null;

    $scope.nextChapter = 'John 1';

    ReaderService.get($scope.reference).then(function(response) {
        $scope.passage = response.data;
        $scope.text = $sce.trustAsHtml($scope.passage.text);
    }, function() {
        $scope.error = 'Could not fetch passage';
    });

    NavigateService.previous($scope.reference).then(function(reference) {
        $scope.previousChapter = reference;
        ReaderService.get(reference);
    });

    NavigateService.next($scope.reference).then(function(reference) {
        $scope.nextChapter = reference;
        ReaderService.get(reference);
    });
}]);

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

    this.previous = function(reference) {
        var deferred = $q.defer();
        this.get().then(function(books) {
            var matches = reference.match(/(.*) (\d+)/);
            var book = _.findIndex(flatBooks, {name: matches[1]});
            var chapter = parseInt(matches[2]);

            if (chapter == 1) {
                var previousBook = flatBooks[(book - 1) % flatBooks.length];
                deferred.resolve(previousBook.name + ' ' + previousBook.chapters);          
            } else {
                deferred.resolve(matches[1] + ' ' + (chapter - 1));
            }
        }, function() {
            deferred.resolve('John 1');
        });

        return deferred.promise;
    }

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

    this.random = function(genre) {
        var deferred = $q.defer();

        this.get().then(function(response) {
            var category = _.find(response.data.categories, {name: genre});
            var book = _.sample(category.books);
            var chapter = Math.ceil(Math.random() * book.chapters);
            deferred.resolve(book.name + ' ' + chapter);
        }, function() {
            deferred.reject();
        });

        return deferred.promise;
    }
}]);