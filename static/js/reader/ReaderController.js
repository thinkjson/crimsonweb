'use strict';

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