'use strict';

angular.module('crimson').controller('ReaderController', ['$scope', '$routeParams', '$sce', 'ReaderService', 'NavigateService', function($scope, $routeParams, $sce, ReaderService, NavigateService) {
    $scope.reference = $routeParams.reference;
    $scope.passage = {};
    $scope.error = null;

    $scope.$sce = $sce;

    $scope.nextChapter = 'John 1';

    ReaderService.get($scope.reference).then(function(response) {
        $scope.passage = response.data;
    }, function() {
        $scope.error = 'Could not fetch passage';
    });

    NavigateService.next($scope.reference).then(function(reference) {
    	$scope.nextChapter = reference;
    })
}]);