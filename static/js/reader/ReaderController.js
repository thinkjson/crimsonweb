'use strict';

angular.module('crimson').controller('ReaderController', ['$scope', '$routeParams', '$sce', 'ReaderService', function($scope, $routeParams, $sce, ReaderService) {
    $scope.reference = $routeParams.reference;
    $scope.passage = {};
    $scope.error = null;

    $scope.$sce = $sce;

    ReaderService.get($scope.reference).then(function(response) {
        $scope.passage = response.data;
    }, function() {
        $scope.error = 'Could not fetch passage';
    })
}]);