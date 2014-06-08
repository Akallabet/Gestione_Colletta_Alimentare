'use strict';

collettaApp.controller('HomeCtrl', ['$scope', '$resource', '$location', '$routeParams', 'UserInfoService', 'VersionService',
function($scope, $resource, $location, $routeParams, UserInfoService, VersionService)
{
	$scope.version= VersionService.version;
    $scope.token= $routeParams.token;

    $scope.user= UserInfoService.info;
}]);
