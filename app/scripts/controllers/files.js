'use strict';

var FilesCtrl=['$scope', '$resource', '$location', '$routeParams', 'UserInfoService', 'VersionService',
function($scope, $resource, $location, $routeParams, UserInfoService, VersionService)
{
	$scope.version= VersionService.version;
	$scope.token= $routeParams.token;
	
}]